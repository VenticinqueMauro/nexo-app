/**
 * Industry definitions and utilities
 * Single source of truth for industry-related data
 */

import {
  Truck,
  Store,
  ShoppingBag,
  Wrench,
} from 'lucide-react'
import type { IndustryType, IndustryInfo } from '@/types/app.types'

// =============================================================================
// Industry Names (Spanish)
// =============================================================================

export const INDUSTRY_NAMES: Record<IndustryType, string> = {
  distributor: 'Distribuidora',
  retail: 'Tienda / Retail',
  grocery: 'Almacen / Kiosco',
  service: 'Servicios',
} as const

/**
 * Get the display name for an industry
 * Returns 'Negocio' as fallback for unknown industries
 */
export function getIndustryName(industry: string | undefined | null): string {
  if (!industry) return 'Negocio'
  return INDUSTRY_NAMES[industry as IndustryType] ?? 'Negocio'
}

// =============================================================================
// Industry Full Definitions (for UI cards, onboarding, etc.)
// =============================================================================

export const INDUSTRIES: IndustryInfo[] = [
  {
    id: 'distributor',
    name: 'Distribuidora',
    description: 'Bebidas, alimentos, productos mayoristas',
    icon: Truck,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderColor: 'border-blue-500',
  },
  {
    id: 'retail',
    name: 'Tienda / Retail',
    description: 'Ropa, accesorios, productos al por menor',
    icon: Store,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
    borderColor: 'border-purple-500',
  },
  {
    id: 'grocery',
    name: 'Almacen / Kiosco',
    description: 'Comercio de barrio, productos variados',
    icon: ShoppingBag,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 hover:bg-green-500/20',
    borderColor: 'border-green-500',
  },
  {
    id: 'service',
    name: 'Servicios',
    description: 'Lavanderia, taller, servicios profesionales',
    icon: Wrench,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500',
  },
] as const

/**
 * Get full industry info by ID
 */
export function getIndustryById(id: IndustryType): IndustryInfo | undefined {
  return INDUSTRIES.find((industry) => industry.id === id)
}
