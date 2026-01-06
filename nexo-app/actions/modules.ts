'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import type { ModuleId, ModulesConfig } from '@/types/modules.types'
import { MODULES, isModuleEnabled } from '@/lib/modules'

const logger = createLogger('actions/modules')

export type UpdateModuleResult = {
  success: boolean
  error?: string
}

/**
 * Toggle a module's enabled state
 */
export async function toggleModuleAction(
  moduleId: ModuleId,
  enabled: boolean
): Promise<UpdateModuleResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autenticado' }
    }

    // Get user's business
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('business_id')
      .eq('id', user.id)
      .single<{ business_id: string | null }>()

    if (userError || !userData?.business_id) {
      return { success: false, error: 'No se encontró el negocio' }
    }

    // Get current business config
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('config')
      .eq('id', userData.business_id)
      .single<{ config: Record<string, unknown> | null }>()

    if (businessError) {
      logger.error('Error fetching business', { error: businessError })
      return { success: false, error: 'Error al obtener configuración' }
    }

    // Check if module can be disabled (core modules cannot)
    const moduleInfo = MODULES[moduleId]
    if (!moduleInfo) {
      return { success: false, error: 'Módulo no válido' }
    }

    if (!moduleInfo.canDisable && !enabled) {
      return { success: false, error: 'Este módulo no puede ser desactivado' }
    }

    // Check dependencies when enabling
    if (enabled && moduleInfo.dependencies) {
      // We need to check if dependencies are enabled
      // For now, we'll just allow it since we're in dev mode
    }

    // Check if disabling would break other modules
    if (!enabled && moduleInfo.requiredBy) {
      // In a real scenario, we'd check if any requiredBy modules are enabled
      // and prevent disabling if so
    }

    // Update config
    const currentConfig = (business?.config || {}) as Record<string, unknown>
    const currentModules = (currentConfig.modules || {}) as ModulesConfig

    // Get current module config if exists
    const currentModuleConfig = currentModules[moduleId as keyof ModulesConfig]

    // Create or update the module config
    const updatedModules: ModulesConfig = {
      ...currentModules,
      [moduleId]: {
        ...(currentModuleConfig || {}),
        enabled,
      },
    }

    const updatedConfig = {
      ...currentConfig,
      modules: updatedModules,
    }

    // Save to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('businesses')
      .update({ config: updatedConfig })
      .eq('id', userData.business_id)

    if (updateError) {
      logger.error('Error updating business config', { error: updateError })
      return { success: false, error: 'Error al guardar configuración' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings/modules')

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in toggleModuleAction', { error })
    return { success: false, error: 'Error inesperado' }
  }
}

/**
 * Reset modules to industry defaults
 */
export async function resetModulesToDefaultsAction(): Promise<UpdateModuleResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'No autenticado' }
    }

    // Get user's business with industry
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('business_id, business:businesses(industry, config)')
      .eq('id', user.id)
      .single<{
        business_id: string | null
        business: { industry: string; config: Record<string, unknown> | null } | null
      }>()

    if (userError || !userData?.business_id) {
      return { success: false, error: 'No se encontró el negocio' }
    }

    const business = userData.business
    if (!business) {
      return { success: false, error: 'No se encontró el negocio' }
    }

    // Import and generate default config
    const { generateDefaultModulesConfig } = await import('@/lib/modules')
    const { isValidIndustry } = await import('@/lib/config')

    if (!isValidIndustry(business.industry)) {
      return { success: false, error: 'Industria no válida' }
    }

    const defaultModules = generateDefaultModulesConfig(business.industry)

    // Update config keeping other settings
    const updatedConfig = {
      ...(business.config || {}),
      modules: defaultModules,
    }

    // Save to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('businesses')
      .update({ config: updatedConfig })
      .eq('id', userData.business_id)

    if (updateError) {
      logger.error('Error resetting modules', { error: updateError })
      return { success: false, error: 'Error al restablecer configuración' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings/modules')

    return { success: true }
  } catch (error) {
    logger.error('Unexpected error in resetModulesToDefaultsAction', { error })
    return { success: false, error: 'Error inesperado' }
  }
}
