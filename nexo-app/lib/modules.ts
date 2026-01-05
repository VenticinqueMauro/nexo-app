/**
 * Module System
 * Centralized metadata and helpers for Nexo's modular architecture
 */

import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Warehouse,
  ShoppingCart,
  CreditCard,
  Truck,
  Palette,
  Tags,
  BarChart3,
  Repeat,
  Route,
  MapPin,
  Brain,
  Building2,
  LineChart,
  Code,
  Paintbrush,
  UserCog,
  FileText,
} from 'lucide-react'

import type {
  ModuleId,
  ModuleMetadata,
  ModuleTier,
  ModuleCategory,
  ModulesConfig,
  SubscriptionPlan,
} from '@/types/modules.types'
import type { IndustryType, Business } from '@/types/app.types'

// Re-export types for convenience
export type { ModuleMetadata, ModuleId } from '@/types/modules.types'

// =============================================================================
// Module Metadata Registry
// =============================================================================

/**
 * Complete registry of all available modules
 * This is the source of truth for module information
 */
export const MODULES: Record<ModuleId, ModuleMetadata> = {
  // ---------------------------------------------------------------------------
  // CORE MODULES (Always active, cannot be disabled)
  // ---------------------------------------------------------------------------
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Vista principal con métricas y resumen del negocio',
    tier: 'core',
    category: 'core',
    icon: LayoutDashboard,
    defaultEnabled: 'all',
    canDisable: false,
  },
  products: {
    id: 'products',
    name: 'Productos',
    description: 'Catálogo de productos y servicios',
    tier: 'core',
    category: 'core',
    icon: Package,
    defaultEnabled: 'all',
    canDisable: false,
  },
  customers: {
    id: 'customers',
    name: 'Clientes',
    description: 'Gestión de clientes y contactos',
    tier: 'core',
    category: 'core',
    icon: Users,
    defaultEnabled: 'all',
    canDisable: false,
  },
  settings: {
    id: 'settings',
    name: 'Configuración',
    description: 'Configuración del negocio y preferencias',
    tier: 'core',
    category: 'core',
    icon: Settings,
    defaultEnabled: 'all',
    canDisable: false,
  },

  // ---------------------------------------------------------------------------
  // FREE TIER MODULES
  // ---------------------------------------------------------------------------
  stock: {
    id: 'stock',
    name: 'Inventario',
    description: 'Control de stock y movimientos de mercadería',
    tier: 'free',
    category: 'inventory',
    icon: Warehouse,
    defaultEnabled: ['distributor', 'retail', 'grocery'],
    canDisable: true,
    requiredBy: ['inventory_ai', 'multi_warehouse'],
  },
  orders: {
    id: 'orders',
    name: 'Pedidos',
    description: 'Gestión de pedidos y ventas',
    tier: 'free',
    category: 'commerce',
    icon: ShoppingCart,
    defaultEnabled: ['distributor', 'retail', 'service'],
    canDisable: true,
    requiredBy: ['deliveries', 'recurring_orders'],
  },
  payments: {
    id: 'payments',
    name: 'Cobros',
    description: 'Registro de pagos y cuenta corriente',
    tier: 'free',
    category: 'commerce',
    icon: CreditCard,
    defaultEnabled: 'all',
    canDisable: true,
  },

  // ---------------------------------------------------------------------------
  // PRO TIER MODULES
  // ---------------------------------------------------------------------------
  deliveries: {
    id: 'deliveries',
    name: 'Entregas',
    description: 'Gestión de entregas y logística',
    tier: 'pro',
    category: 'logistics',
    icon: Truck,
    defaultEnabled: ['distributor'],
    canDisable: true,
    dependencies: ['orders'],
    requiredBy: ['route_optimization'],
  },
  variants: {
    id: 'variants',
    name: 'Variantes',
    description: 'Productos con variantes (talle, color, etc.)',
    tier: 'pro',
    category: 'inventory',
    icon: Palette,
    defaultEnabled: ['retail'],
    canDisable: true,
    dependencies: ['stock'],
  },
  tiered_pricing: {
    id: 'tiered_pricing',
    name: 'Precios Escalonados',
    description: 'Precios por cantidad (mayorista)',
    tier: 'pro',
    category: 'commerce',
    icon: Tags,
    defaultEnabled: ['distributor'],
    canDisable: true,
  },
  reports: {
    id: 'reports',
    name: 'Reportes',
    description: 'Informes de ventas, stock y clientes',
    tier: 'pro',
    category: 'analytics',
    icon: BarChart3,
    defaultEnabled: 'none',
    canDisable: true,
  },
  recurring_orders: {
    id: 'recurring_orders',
    name: 'Pedidos Recurrentes',
    description: '"Lo de siempre" - Pedidos que se repiten',
    tier: 'pro',
    category: 'commerce',
    icon: Repeat,
    defaultEnabled: ['distributor'],
    canDisable: true,
    dependencies: ['orders'],
  },

  // ---------------------------------------------------------------------------
  // BUSINESS TIER MODULES
  // ---------------------------------------------------------------------------
  route_optimization: {
    id: 'route_optimization',
    name: 'Optimización de Rutas',
    description: 'Optimiza rutas de entrega con IA',
    tier: 'business',
    category: 'ai',
    icon: Route,
    defaultEnabled: 'none',
    canDisable: true,
    dependencies: ['deliveries'],
    badge: 'IA',
  },
  google_places: {
    id: 'google_places',
    name: 'Google Places',
    description: 'Busca clientes cercanos y autocompletado de direcciones',
    tier: 'business',
    category: 'integration',
    icon: MapPin,
    defaultEnabled: 'none',
    canDisable: true,
  },
  inventory_ai: {
    id: 'inventory_ai',
    name: 'Inventario Inteligente',
    description: 'Predicción de stock y sugerencias de reposición',
    tier: 'business',
    category: 'ai',
    icon: Brain,
    defaultEnabled: 'none',
    canDisable: true,
    dependencies: ['stock'],
    badge: 'IA',
  },
  multi_warehouse: {
    id: 'multi_warehouse',
    name: 'Multi-Depósito',
    description: 'Gestiona stock en múltiples ubicaciones',
    tier: 'business',
    category: 'inventory',
    icon: Building2,
    defaultEnabled: 'none',
    canDisable: true,
    dependencies: ['stock'],
  },
  advanced_analytics: {
    id: 'advanced_analytics',
    name: 'Analytics Avanzado',
    description: 'Dashboards personalizados y métricas avanzadas',
    tier: 'business',
    category: 'analytics',
    icon: LineChart,
    defaultEnabled: 'none',
    canDisable: true,
  },

  // ---------------------------------------------------------------------------
  // ENTERPRISE TIER MODULES
  // ---------------------------------------------------------------------------
  api_access: {
    id: 'api_access',
    name: 'Acceso API',
    description: 'API REST para integraciones externas',
    tier: 'enterprise',
    category: 'integration',
    icon: Code,
    defaultEnabled: 'none',
    canDisable: true,
  },
  white_label: {
    id: 'white_label',
    name: 'Marca Blanca',
    description: 'Personaliza colores, logo y dominio',
    tier: 'enterprise',
    category: 'integration',
    icon: Paintbrush,
    defaultEnabled: 'none',
    canDisable: true,
  },
  team_management: {
    id: 'team_management',
    name: 'Gestión de Equipo',
    description: 'Roles personalizados y permisos avanzados',
    tier: 'enterprise',
    category: 'core',
    icon: UserCog,
    defaultEnabled: 'none',
    canDisable: true,
  },
  audit_log: {
    id: 'audit_log',
    name: 'Registro de Auditoría',
    description: 'Historial detallado de todas las acciones',
    tier: 'enterprise',
    category: 'core',
    icon: FileText,
    defaultEnabled: 'none',
    canDisable: true,
  },
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get module metadata by ID
 */
export function getModule(moduleId: ModuleId): ModuleMetadata {
  return MODULES[moduleId]
}

/**
 * Get all modules
 */
export function getAllModules(): ModuleMetadata[] {
  return Object.values(MODULES)
}

/**
 * Get modules by tier
 */
export function getModulesByTier(tier: ModuleTier): ModuleMetadata[] {
  return getAllModules().filter((m) => m.tier === tier)
}

/**
 * Get modules by category
 */
export function getModulesByCategory(category: ModuleCategory): ModuleMetadata[] {
  return getAllModules().filter((m) => m.category === category)
}

/**
 * Get core modules (always active)
 */
export function getCoreModules(): ModuleMetadata[] {
  return getModulesByTier('core')
}

/**
 * Get toggleable modules (can be enabled/disabled)
 */
export function getToggleableModules(): ModuleMetadata[] {
  return getAllModules().filter((m) => m.canDisable)
}

/**
 * Check if a module is enabled for a business
 * Core modules are always enabled
 */
export function isModuleEnabled(
  business: Business | null,
  moduleId: ModuleId
): boolean {
  // No business = no access (except during development)
  if (!business) {
    return process.env.NODE_ENV === 'development'
  }

  const module = MODULES[moduleId]
  if (!module) return false

  // Core modules are always enabled
  if (module.tier === 'core') return true

  // Check subscription (bypass for development)
  const subscription = business.config?.subscription
  if (subscription?.bypassRestrictions) {
    // In dev mode, check if explicitly disabled in config
    const moduleConfig = business.config?.modules?.[moduleId as keyof ModulesConfig]
    if (moduleConfig && 'enabled' in moduleConfig) {
      return moduleConfig.enabled
    }
    // Default to checking industry defaults
    return isDefaultEnabled(moduleId, business.industry)
  }

  // Check tier access
  const plan = subscription?.plan || 'free'
  if (!hasTierAccess(plan, module.tier)) {
    return false
  }

  // Check if explicitly configured
  const moduleConfig = business.config?.modules?.[moduleId as keyof ModulesConfig]
  if (moduleConfig && 'enabled' in moduleConfig) {
    return moduleConfig.enabled
  }

  // Fall back to industry default
  return isDefaultEnabled(moduleId, business.industry)
}

/**
 * Check if a subscription plan has access to a module tier
 */
export function hasTierAccess(plan: SubscriptionPlan, tier: ModuleTier): boolean {
  const tierHierarchy: ModuleTier[] = ['core', 'free', 'pro', 'business', 'enterprise']
  const planTiers: Record<SubscriptionPlan, ModuleTier[]> = {
    free: ['core', 'free'],
    pro: ['core', 'free', 'pro'],
    business: ['core', 'free', 'pro', 'business'],
    enterprise: ['core', 'free', 'pro', 'business', 'enterprise'],
  }

  return planTiers[plan].includes(tier)
}

/**
 * Check if a module is enabled by default for an industry
 */
export function isDefaultEnabled(moduleId: ModuleId, industry: IndustryType): boolean {
  const module = MODULES[moduleId]
  if (!module) return false

  if (module.defaultEnabled === 'all') return true
  if (module.defaultEnabled === 'none') return false

  return module.defaultEnabled.includes(industry)
}

/**
 * Get modules enabled by default for an industry
 */
export function getDefaultModulesForIndustry(industry: IndustryType): ModuleId[] {
  return getAllModules()
    .filter((m) => {
      if (m.tier === 'core') return true
      if (m.defaultEnabled === 'all') return true
      if (m.defaultEnabled === 'none') return false
      return m.defaultEnabled.includes(industry)
    })
    .map((m) => m.id)
}

/**
 * Check if a module can be enabled (dependencies met, tier access)
 */
export function canEnableModule(
  business: Business,
  moduleId: ModuleId
): { canEnable: boolean; reason?: string } {
  const module = MODULES[moduleId]
  if (!module) {
    return { canEnable: false, reason: 'Módulo no existe' }
  }

  // Core modules are always enabled
  if (module.tier === 'core') {
    return { canEnable: true }
  }

  // Check tier access
  const plan = business.config?.subscription?.plan || 'free'
  if (!hasTierAccess(plan, module.tier)) {
    return {
      canEnable: false,
      reason: `Requiere plan ${module.tier.toUpperCase()}`,
    }
  }

  // Check dependencies
  if (module.dependencies) {
    for (const depId of module.dependencies) {
      if (!isModuleEnabled(business, depId)) {
        const dep = MODULES[depId]
        return {
          canEnable: false,
          reason: `Requiere módulo "${dep?.name || depId}" activo`,
        }
      }
    }
  }

  return { canEnable: true }
}

/**
 * Get module configuration with defaults
 */
export function getModuleConfig<T extends keyof ModulesConfig>(
  business: Business | null,
  moduleId: T
): ModulesConfig[T] | undefined {
  if (!business) return undefined
  return business.config?.modules?.[moduleId]
}

/**
 * Generate default modules configuration for a new business
 */
export function generateDefaultModulesConfig(industry: IndustryType): ModulesConfig {
  const config: ModulesConfig = {}

  for (const module of getToggleableModules()) {
    const enabled = isDefaultEnabled(module.id, industry)
    const moduleId = module.id as keyof ModulesConfig

    // Only include if enabled or has specific defaults
    if (enabled) {
      switch (moduleId) {
        case 'stock':
          config.stock = {
            enabled: true,
            lowStockThreshold: 10,
            trackByVariant: industry === 'retail',
            showProjections: industry === 'distributor',
          }
          break
        case 'orders':
          config.orders = {
            enabled: true,
            requireCustomer: industry === 'distributor',
            allowPartialPayment: true,
            defaultStatus: 'pending',
          }
          break
        case 'payments':
          config.payments = {
            enabled: true,
            enableCurrentAccount: true,
            autoReminders: industry === 'distributor',
            reminderDays: [7, 14, 30],
          }
          break
        case 'deliveries':
          config.deliveries = {
            enabled: true,
            type: 'own_fleet',
            requireSchedule: false,
          }
          break
        case 'variants':
          config.variants = {
            enabled: true,
            attributes: ['size', 'color'],
            showMatrix: true,
          }
          break
        case 'tiered_pricing':
          config.tiered_pricing = {
            enabled: true,
            showInCatalog: true,
            applyAutomatically: true,
          }
          break
        case 'recurring_orders':
          config.recurring_orders = {
            enabled: true,
            maxTemplatesPerCustomer: 5,
            allowAutoConfirm: false,
          }
          break
        default:
          // For other modules, just enable them
          // TypeScript will ensure we handle all cases
          break
      }
    }
  }

  return config
}

// =============================================================================
// Module Navigation Helpers
// =============================================================================

/**
 * Modules that appear in the main navigation
 */
export const NAVIGATION_MODULES: ModuleId[] = [
  'dashboard',
  'products',
  'customers',
  'orders',
  'deliveries',
  'payments',
  'settings',
]

/**
 * Get navigation items based on enabled modules
 */
export function getNavigationModules(business: Business | null): ModuleMetadata[] {
  return NAVIGATION_MODULES
    .map((id) => MODULES[id])
    .filter((module) => isModuleEnabled(business, module.id))
}
