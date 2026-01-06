/**
 * Module Icons Map
 * Separated from module metadata to allow serialization from Server to Client Components
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
  MessageCircle,
  Send,
  Mic,
  type LucideIcon,
} from 'lucide-react'

import type { ModuleId } from '@/types/modules.types'

/**
 * Map of module IDs to their icons
 * Used by client components to render icons
 */
export const MODULE_ICONS: Record<ModuleId, LucideIcon> = {
  // Core
  dashboard: LayoutDashboard,
  products: Package,
  customers: Users,
  settings: Settings,
  // Free
  stock: Warehouse,
  orders: ShoppingCart,
  payments: CreditCard,
  chat: MessageCircle,
  // Pro
  deliveries: Truck,
  variants: Palette,
  tiered_pricing: Tags,
  reports: BarChart3,
  recurring_orders: Repeat,
  telegram_bot: Send,
  // Business
  route_optimization: Route,
  google_places: MapPin,
  inventory_ai: Brain,
  multi_warehouse: Building2,
  advanced_analytics: LineChart,
  voice_input: Mic,
  // Enterprise
  api_access: Code,
  white_label: Paintbrush,
  team_management: UserCog,
  audit_log: FileText,
}

/**
 * Get icon component for a module
 */
export function getModuleIcon(moduleId: ModuleId): LucideIcon {
  return MODULE_ICONS[moduleId]
}
