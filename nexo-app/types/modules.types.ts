/**
 * Module System Types
 * Defines the structure for Nexo's modular architecture
 *
 * Architecture:
 * - CORE: Always active, cannot be disabled
 * - FREE: Included in free tier, can be toggled
 * - PRO: Requires Pro subscription
 * - BUSINESS: Requires Business subscription
 * - ENTERPRISE: Requires Enterprise subscription
 */

import type { LucideIcon } from 'lucide-react'
import type { IndustryType } from './app.types'

// =============================================================================
// Module Tiers
// =============================================================================

export type ModuleTier = 'core' | 'free' | 'pro' | 'business' | 'enterprise'

export type SubscriptionPlan = 'free' | 'pro' | 'business' | 'enterprise'

/**
 * Maps subscription plans to their included tiers
 * Each plan includes all tiers below it
 */
export const PLAN_INCLUDES_TIERS: Record<SubscriptionPlan, ModuleTier[]> = {
  free: ['core', 'free'],
  pro: ['core', 'free', 'pro'],
  business: ['core', 'free', 'pro', 'business'],
  enterprise: ['core', 'free', 'pro', 'business', 'enterprise'],
}

// =============================================================================
// Module Categories
// =============================================================================

export type ModuleCategory =
  | 'core'        // Essential system modules
  | 'commerce'    // Products, orders, payments
  | 'inventory'   // Stock management
  | 'logistics'   // Deliveries, routes
  | 'analytics'   // Reports, insights
  | 'ai'          // AI-powered features
  | 'integration' // External services

// =============================================================================
// Module IDs
// =============================================================================

/**
 * All available module identifiers
 */
export type ModuleId =
  // Core (always active)
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'settings'
  // Free tier
  | 'stock'
  | 'orders'
  | 'payments'
  | 'chat'              // Chat interno en la app
  // Pro tier
  | 'deliveries'
  | 'variants'
  | 'tiered_pricing'
  | 'reports'
  | 'recurring_orders'
  | 'telegram_bot'      // Bot de Telegram
  // Business tier
  | 'route_optimization'
  | 'google_places'
  | 'inventory_ai'
  | 'multi_warehouse'
  | 'advanced_analytics'
  | 'voice_input'       // Entrada por voz
  // Enterprise tier
  | 'api_access'
  | 'white_label'
  | 'team_management'
  | 'audit_log'

// =============================================================================
// Module Metadata
// =============================================================================

/**
 * Complete metadata for a module (includes icon component)
 */
export type ModuleMetadata = {
  id: ModuleId
  name: string
  description: string
  tier: ModuleTier
  category: ModuleCategory
  icon: LucideIcon

  // Activation rules
  defaultEnabled: IndustryType[] | 'all' | 'none'
  canDisable: boolean

  // Dependencies
  dependencies?: ModuleId[]      // Modules this one requires
  requiredBy?: ModuleId[]        // Modules that require this one

  // UI
  comingSoon?: boolean           // Show as "coming soon" in UI
  badge?: string                 // Badge to show (e.g., "NEW", "BETA")
}

/**
 * Serializable version of ModuleMetadata (without icon component)
 * Use this when passing module data from Server to Client Components
 */
export type SerializableModuleMetadata = Omit<ModuleMetadata, 'icon'>

// =============================================================================
// Module Configuration (stored in business.config.modules)
// =============================================================================

/**
 * Base configuration for any module
 */
export type BaseModuleConfig = {
  enabled: boolean
}

/**
 * Stock module configuration
 */
export type StockModuleConfig = BaseModuleConfig & {
  lowStockThreshold?: number     // Alert when stock falls below this
  trackByVariant?: boolean       // Track stock per variant
  showProjections?: boolean      // Show "days of stock remaining"
}

/**
 * Orders module configuration
 */
export type OrdersModuleConfig = BaseModuleConfig & {
  requireCustomer?: boolean      // Require customer for orders
  allowPartialPayment?: boolean  // Allow partial payments
  defaultStatus?: 'pending' | 'confirmed'
}

/**
 * Payments module configuration
 */
export type PaymentsModuleConfig = BaseModuleConfig & {
  enableCurrentAccount?: boolean // Account balances (fiado)
  autoReminders?: boolean        // Automatic payment reminders
  reminderDays?: number[]        // Days to send reminders [7, 14, 30]
}

/**
 * Deliveries module configuration
 */
export type DeliveriesModuleConfig = BaseModuleConfig & {
  type?: 'own_fleet' | 'third_party' | 'pickup' | 'mixed'
  requireSchedule?: boolean      // Require delivery date/time
  maxStopsPerRoute?: number      // Limit stops per route
}

/**
 * Variants module configuration
 */
export type VariantsModuleConfig = BaseModuleConfig & {
  attributes?: string[]          // ['size', 'color', 'material']
  showMatrix?: boolean           // Show variant matrix in UI
}

/**
 * Tiered Pricing module configuration
 */
export type TieredPricingModuleConfig = BaseModuleConfig & {
  showInCatalog?: boolean        // Show tier prices in product catalog
  applyAutomatically?: boolean   // Auto-apply best price
}

/**
 * Reports module configuration
 */
export type ReportsModuleConfig = BaseModuleConfig & {
  emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never'
  emailRecipients?: string[]
}

/**
 * Recurring Orders module configuration
 */
export type RecurringOrdersModuleConfig = BaseModuleConfig & {
  maxTemplatesPerCustomer?: number
  allowAutoConfirm?: boolean     // Auto-confirm recurring orders
}

/**
 * Route Optimization module configuration
 */
export type RouteOptimizationModuleConfig = BaseModuleConfig & {
  provider?: 'google_maps' | 'mapbox' | 'osrm'
  optimizeFor?: 'distance' | 'time' | 'balanced'
  avoidTolls?: boolean
}

/**
 * Google Places module configuration
 */
export type GooglePlacesModuleConfig = BaseModuleConfig & {
  searchRadius?: number          // Search radius in km
  autoSuggestAddress?: boolean   // Auto-suggest while typing
}

/**
 * Inventory AI module configuration
 */
export type InventoryAIModuleConfig = BaseModuleConfig & {
  predictionDays?: number        // Days to predict ahead
  autoReorderSuggestions?: boolean
}

/**
 * Multi Warehouse module configuration
 */
export type MultiWarehouseModuleConfig = BaseModuleConfig & {
  defaultWarehouseId?: string
  allowTransfers?: boolean       // Allow stock transfers
}

/**
 * Advanced Analytics module configuration
 */
export type AdvancedAnalyticsModuleConfig = BaseModuleConfig & {
  retentionDays?: number         // Data retention period
  enableExport?: boolean         // Allow data export
}

/**
 * API Access module configuration
 */
export type ApiAccessModuleConfig = BaseModuleConfig & {
  rateLimit?: number             // Requests per minute
  allowedOrigins?: string[]      // CORS origins
}

/**
 * White Label module configuration
 */
export type WhiteLabelModuleConfig = BaseModuleConfig & {
  customLogo?: string
  customColors?: {
    primary?: string
    secondary?: string
  }
  customDomain?: string
}

/**
 * Team Management module configuration
 */
export type TeamManagementModuleConfig = BaseModuleConfig & {
  maxUsers?: number
  customRoles?: boolean          // Allow custom role creation
}

/**
 * Audit Log module configuration
 */
export type AuditLogModuleConfig = BaseModuleConfig & {
  retentionDays?: number
  logLevel?: 'basic' | 'detailed' | 'verbose'
}

/**
 * Chat module configuration
 */
export type ChatModuleConfig = BaseModuleConfig & {
  showSuggestions?: boolean        // Mostrar sugerencias de acciones
  enableHistory?: boolean          // Guardar historial de conversaciones
  maxHistoryDays?: number          // Días de historial a mantener
}

/**
 * Telegram Bot module configuration
 */
export type TelegramBotModuleConfig = BaseModuleConfig & {
  botToken?: string                // Token del bot (almacenado de forma segura)
  allowCustomerBot?: boolean       // Permitir bot para clientes
  notifyOnOrders?: boolean         // Notificar nuevos pedidos
  notifyOnPayments?: boolean       // Notificar pagos recibidos
  notifyOnLowStock?: boolean       // Notificar stock bajo
}

/**
 * Voice Input module configuration
 */
export type VoiceInputModuleConfig = BaseModuleConfig & {
  provider?: 'whisper' | 'google' | 'azure'
  language?: string                // Idioma principal (es-AR, es-MX, etc.)
  autoSend?: boolean               // Enviar automáticamente al terminar de hablar
}

// =============================================================================
// Combined Modules Configuration
// =============================================================================

/**
 * All module configurations combined
 * Stored in business.config.modules
 */
export type ModulesConfig = {
  // Free tier
  stock?: StockModuleConfig
  orders?: OrdersModuleConfig
  payments?: PaymentsModuleConfig
  chat?: ChatModuleConfig

  // Pro tier
  deliveries?: DeliveriesModuleConfig
  variants?: VariantsModuleConfig
  tiered_pricing?: TieredPricingModuleConfig
  reports?: ReportsModuleConfig
  recurring_orders?: RecurringOrdersModuleConfig
  telegram_bot?: TelegramBotModuleConfig

  // Business tier
  route_optimization?: RouteOptimizationModuleConfig
  google_places?: GooglePlacesModuleConfig
  inventory_ai?: InventoryAIModuleConfig
  multi_warehouse?: MultiWarehouseModuleConfig
  advanced_analytics?: AdvancedAnalyticsModuleConfig
  voice_input?: VoiceInputModuleConfig

  // Enterprise tier
  api_access?: ApiAccessModuleConfig
  white_label?: WhiteLabelModuleConfig
  team_management?: TeamManagementModuleConfig
  audit_log?: AuditLogModuleConfig
}

// =============================================================================
// Subscription Configuration
// =============================================================================

/**
 * Subscription information stored in business.config
 */
export type SubscriptionConfig = {
  plan: SubscriptionPlan
  status: 'active' | 'trial' | 'expired' | 'cancelled'
  trialEndsAt?: string           // ISO date string
  currentPeriodEndsAt?: string   // ISO date string

  // For development/testing: bypass all restrictions
  bypassRestrictions?: boolean
}

/**
 * Default subscription for development
 * All features available, no restrictions
 */
export const DEV_SUBSCRIPTION: SubscriptionConfig = {
  plan: 'enterprise',
  status: 'active',
  bypassRestrictions: true,
}
