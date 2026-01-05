'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import type { UserWithBusiness } from '@/types/app.types'

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
// Hook
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
// Utility Hooks
// =============================================================================

/**
 * Hook to get just the user's business
 * Returns null if user has no business (shouldn't happen in dashboard)
 */
export function useBusiness() {
  const { user } = useUser()
  return user.business
}

/**
 * Hook to check if a module is enabled for the user's business
 */
export function useModuleEnabled(module: 'stock' | 'orders' | 'deliveries' | 'billing'): boolean {
  const business = useBusiness()
  return business?.config?.modules?.[module]?.enabled ?? false
}
