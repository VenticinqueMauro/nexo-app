import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get user data with business info
  const { data: userData, error: dataError } = await supabase
    .from('users')
    .select('*, business:businesses(*)')
    .eq('id', user.id)
    .single<{ id: string; name: string; email: string; role: string; business_id: string | null; business: any }>()

  if (dataError || !userData) {
    redirect('/login')
  }

  // If user doesn't have a business, redirect to onboarding
  if (!userData.business_id) {
    redirect('/onboarding')
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={userData} />
      <SidebarInset>
        <DashboardHeader user={userData} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
