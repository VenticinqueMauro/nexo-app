-- Improved trigger with better error handling and RLS bypass

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- This bypasses RLS policies
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Extract name from metadata, use email as fallback
  user_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert new user into public.users table
  -- Using SECURITY DEFINER ensures this bypasses RLS
  INSERT INTO public.users (id, email, name, role, business_id, active, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    'owner',
    NULL,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent errors if user already exists

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure the function owner has necessary permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Verify the trigger was created
SELECT
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
