import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Not authenticated, redirect to login
    redirect('/login')
  }

  // User is authenticated, check if they have completed onboarding
  const { data: userData } = await supabase
    .from('users')
    .select('business_id')
    .eq('id', user.id)
    .single<{ business_id: string | null }>()

  if (!userData?.business_id) {
    // User hasn't completed onboarding
    redirect('/onboarding')
  }

  // User is authenticated and has completed onboarding
  redirect('/dashboard')
}
