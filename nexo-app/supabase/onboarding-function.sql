-- =====================================================================
-- ONBOARDING FUNCTION - Consolidated solution for creating business
-- Uses SECURITY DEFINER to bypass RLS (same pattern as user trigger)
-- This is the recommended Supabase pattern for operations that need
-- to bypass RLS during specific flows like onboarding
-- =====================================================================

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.complete_onboarding(TEXT, TEXT, TEXT, TEXT, JSONB);

-- Create the onboarding function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.complete_onboarding(
  p_business_name TEXT,
  p_industry TEXT,
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_config JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_business_id UUID;
  v_existing_business_id UUID;
  v_final_config JSONB;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Check if user already has a business
  SELECT business_id INTO v_existing_business_id
  FROM public.users
  WHERE id = v_user_id;

  IF v_existing_business_id IS NOT NULL THEN
    RAISE EXCEPTION 'User already has a business';
  END IF;

  -- Validate industry
  IF p_industry NOT IN ('distributor', 'retail', 'grocery', 'service') THEN
    RAISE EXCEPTION 'Invalid industry type';
  END IF;

  -- Build final config with contact info
  v_final_config := p_config || jsonb_build_object(
    'contact', jsonb_build_object(
      'phone', p_phone,
      'address', p_address
    )
  );

  -- Create the business
  INSERT INTO public.businesses (name, industry, config)
  VALUES (p_business_name, p_industry, v_final_config)
  RETURNING id INTO v_business_id;

  -- Update user with business_id
  UPDATE public.users
  SET business_id = v_business_id
  WHERE id = v_user_id;

  RETURN v_business_id;
END;
$$;

-- Set function owner and permissions
ALTER FUNCTION public.complete_onboarding(TEXT, TEXT, TEXT, TEXT, JSONB) OWNER TO postgres;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.complete_onboarding(TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- =====================================================================
-- Also need to fix users table to allow NULL business_id during signup
-- =====================================================================

-- Alter users table to allow NULL business_id (for new users before onboarding)
ALTER TABLE public.users ALTER COLUMN business_id DROP NOT NULL;

-- =====================================================================
-- VERIFICATION
-- =====================================================================

SELECT 'Function created:' as check_name,
       proname,
       prosecdef as is_security_definer
FROM pg_proc
WHERE proname = 'complete_onboarding';

SELECT 'Users business_id nullable:' as check_name,
       column_name,
       is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
  AND column_name = 'business_id';
