import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ModulesPageClient } from './modules-client'
import type { Business } from '@/types/app.types'
import type { ModuleTier, SerializableModuleMetadata } from '@/types/modules.types'
import { getModulesByTier, isModuleEnabled } from '@/lib/modules'

export type ModuleWithEnabled = SerializableModuleMetadata & { enabled: boolean }

export type ModuleGroup = {
  tier: ModuleTier
  modules: ModuleWithEnabled[]
}

export default async function ModulesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user with business
  const { data: userData } = await supabase
    .from('users')
    .select('*, business:businesses(*)')
    .eq('id', user.id)
    .single<{ business: Business | null }>()

  if (!userData?.business) {
    redirect('/onboarding')
  }

  const business = userData.business

  // Get modules grouped by tier with enabled status
  // Note: We exclude 'icon' because React components can't be serialized for Client Components
  const tiers: ModuleTier[] = ['core', 'free', 'pro', 'business', 'enterprise']

  const modulesByTier: ModuleGroup[] = tiers.map(tier => ({
    tier,
    modules: getModulesByTier(tier).map(module => ({
      id: module.id,
      name: module.name,
      description: module.description,
      tier: module.tier,
      category: module.category,
      defaultEnabled: module.defaultEnabled,
      canDisable: module.canDisable,
      dependencies: module.dependencies,
      requiredBy: module.requiredBy,
      comingSoon: module.comingSoon,
      badge: module.badge,
      enabled: isModuleEnabled(business, module.id),
    })),
  })).filter(group => group.modules.length > 0)

  return (
    <ModulesPageClient
      modulesByTier={modulesByTier}
      businessIndustry={business.industry}
    />
  )
}
