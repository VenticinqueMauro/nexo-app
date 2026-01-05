'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { UserWithBusiness, Business } from '@/types/app.types'
import type { ModuleId, ModulesConfig } from '@/types/modules.types'
import {
  isModuleEnabled,
  canEnableModule,
  getModuleConfig,
  getNavigationModules,
  getModule,
  type ModuleMetadata,
} from '@/lib/modules'

// =============================================================================
// User Context
// =============================================================================

type UserContextValue = {
  user: UserWithBusiness
}

const UserContext = createContext<UserContextValue | null>(null)

// =============================================================================
// Provider Component
// =============================================================================

type UserProviderProps = {
  user: UserWithBusiness
  children: ReactNode
}

/**
 * Provider component that wraps the dashboard and provides user data
 * to all child components via context.
 *
 * Usage in layout:
 * ```tsx
 * <UserProvider user={userData}>
 *   {children}
 * </UserProvider>
 * ```
 */
export function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}

// =============================================================================
// Base Hook
// =============================================================================

/**
 * Hook to access the current user data from any client component
 * within the dashboard.
 *
 * @throws Error if used outside of UserProvider
 *
 * Usage:
 * ```tsx
 * const { user } = useUser()
 * console.log(user.name, user.business?.name)
 * ```
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(
      'useUser must be used within a UserProvider. ' +
      'Make sure your component is wrapped in the dashboard layout.'
    )
  }

  return context
}

// =============================================================================
// Business Hook
// =============================================================================

/**
 * Hook to get just the user's business
 * Returns null if user has no business (shouldn't happen in dashboard)
 */
export function useBusiness(): Business | null {
  const { user } = useUser()
  return user.business
}

// =============================================================================
// Module Hooks
// =============================================================================

/**
 * Hook to check if a specific module is enabled
 *
 * Usage:
 * ```tsx
 * const isDeliveriesEnabled = useModuleEnabled('deliveries')
 * if (isDeliveriesEnabled) {
 *   // Show deliveries feature
 * }
 * ```
 */
export function useModuleEnabled(moduleId: ModuleId): boolean {
  const business = useBusiness()
  return isModuleEnabled(business, moduleId)
}

/**
 * Hook to get complete module information including metadata and enabled state
 *
 * Usage:
 * ```tsx
 * const deliveriesModule = useModule('deliveries')
 * if (deliveriesModule.enabled) {
 *   console.log(deliveriesModule.metadata.name) // "Entregas"
 * }
 * ```
 */
export function useModule(moduleId: ModuleId): {
  enabled: boolean
  metadata: ModuleMetadata
  config: ModulesConfig[keyof ModulesConfig] | undefined
  canEnable: { canEnable: boolean; reason?: string }
} {
  const business = useBusiness()

  return useMemo(() => ({
    enabled: isModuleEnabled(business, moduleId),
    metadata: getModule(moduleId),
    config: getModuleConfig(business, moduleId as keyof ModulesConfig),
    canEnable: business
      ? canEnableModule(business, moduleId)
      : { canEnable: false, reason: 'No business' },
  }), [business, moduleId])
}

/**
 * Hook to get multiple module states at once
 *
 * Usage:
 * ```tsx
 * const modules = useModules(['stock', 'deliveries', 'variants'])
 * if (modules.stock && modules.variants) {
 *   // Show variant stock management
 * }
 * ```
 */
export function useModules<T extends ModuleId>(
  moduleIds: T[]
): Record<T, boolean> {
  const business = useBusiness()

  return useMemo(() => {
    const result = {} as Record<T, boolean>
    for (const id of moduleIds) {
      result[id] = isModuleEnabled(business, id)
    }
    return result
  }, [business, moduleIds])
}

/**
 * Hook to get all navigation modules enabled for current business
 *
 * Usage:
 * ```tsx
 * const navModules = useNavigationModules()
 * // Returns array of ModuleMetadata for enabled nav items
 * ```
 */
export function useNavigationModules(): ModuleMetadata[] {
  const business = useBusiness()
  return useMemo(() => getNavigationModules(business), [business])
}

/**
 * Hook to get module configuration with type safety
 *
 * Usage:
 * ```tsx
 * const stockConfig = useModuleConfig('stock')
 * if (stockConfig?.showProjections) {
 *   // Show stock projections
 * }
 * ```
 */
export function useModuleConfig<T extends keyof ModulesConfig>(
  moduleId: T
): ModulesConfig[T] | undefined {
  const business = useBusiness()
  return useMemo(
    () => getModuleConfig(business, moduleId),
    [business, moduleId]
  )
}

// =============================================================================
// Subscription Hook
// =============================================================================

/**
 * Hook to get subscription information
 *
 * Usage:
 * ```tsx
 * const { plan, isTrialing, canUpgrade } = useSubscription()
 * ```
 */
export function useSubscription() {
  const business = useBusiness()

  return useMemo(() => {
    const subscription = business?.config?.subscription
    const plan = subscription?.plan || 'free'
    const status = subscription?.status || 'active'

    return {
      plan,
      status,
      isActive: status === 'active' || status === 'trial',
      isTrialing: status === 'trial',
      bypassRestrictions: subscription?.bypassRestrictions ?? false,
      canUpgrade: plan !== 'enterprise',
      trialEndsAt: subscription?.trialEndsAt
        ? new Date(subscription.trialEndsAt)
        : undefined,
    }
  }, [business])
}
