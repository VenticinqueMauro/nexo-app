import { redirect } from 'next/navigation'

export default function SettingsPage() {
  // Redirect to modules page by default
  redirect('/dashboard/settings/modules')
}
