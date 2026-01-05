/**
 * Application-wide TypeScript types
 * Eliminates `any` types scattered across the codebase
 */

import type { LucideIcon } from 'lucide-react'

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
// Module Configuration Types
// =============================================================================

export type StockModuleConfig = {
  enabled: boolean
  variants?: boolean
  projections?: boolean
}

export type OrdersModuleConfig = {
  enabled: boolean
  recurring?: boolean
  tiered_pricing?: boolean
}

export type DeliveriesModuleConfig = {
  enabled: boolean
  type?: 'own_routes' | 'third_party'
}

export type BillingModuleConfig = {
  enabled: boolean
  current_account?: boolean
  auto_reminders?: boolean
}

export type ModulesConfig = {
  stock?: StockModuleConfig
  orders?: OrdersModuleConfig
  deliveries?: DeliveriesModuleConfig
  billing?: BillingModuleConfig
}

export type ContactConfig = {
  phone?: string | null
  address?: string | null
}

export type BusinessConfig = {
  modules?: ModulesConfig
  contact?: ContactConfig
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
  condition?: (config: BusinessConfig | undefined) => boolean
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
