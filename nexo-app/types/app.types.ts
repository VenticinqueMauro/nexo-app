/**
 * Application-wide TypeScript types
 * Eliminates `any` types scattered across the codebase
 */

import type { LucideIcon } from 'lucide-react'
import type { ModulesConfig, SubscriptionConfig } from './modules.types'

// Re-export module types for convenience
export type { ModulesConfig, SubscriptionConfig } from './modules.types'

// =============================================================================
// Industry Types
// =============================================================================

export type IndustryType = 'distributor' | 'retail' | 'grocery' | 'service'

export type IndustryInfo = {
  id: IndustryType
  name: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

// =============================================================================
// Contact Configuration
// =============================================================================

export type ContactConfig = {
  phone?: string | null
  address?: string | null
  email?: string | null
  website?: string | null
}

// =============================================================================
// Business Configuration
// =============================================================================

/**
 * Complete business configuration stored in JSONB
 */
export type BusinessConfig = {
  modules?: ModulesConfig
  subscription?: SubscriptionConfig
  contact?: ContactConfig

  // Preferences
  preferences?: {
    currency?: string           // 'ARS', 'USD', etc.
    timezone?: string           // 'America/Argentina/Buenos_Aires'
    dateFormat?: string         // 'DD/MM/YYYY'
    language?: string           // 'es', 'en'
  }
}

// =============================================================================
// Business Types
// =============================================================================

export type Business = {
  id: string
  name: string
  industry: IndustryType
  config: BusinessConfig
  created_at?: string
  updated_at?: string
}

// =============================================================================
// User Types
// =============================================================================

export type UserRole = 'owner' | 'seller' | 'warehouse' | 'driver'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  business_id: string | null
  created_at?: string
  updated_at?: string
}

export type UserWithBusiness = User & {
  business: Business | null
}

// =============================================================================
// Dashboard / UI Types
// =============================================================================

export type NavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  badge: string | number | null
  moduleId?: string             // Module this nav item belongs to
}

export type MetricTrend = {
  value: number
  isPositive: boolean
}

export type MetricCardProps = {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend: MetricTrend | null
  color: string
  bgColor: string
}
