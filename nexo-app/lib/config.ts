/**
 * Application configuration constants
 * Centralizes all hardcoded values for easier maintenance
 */

import type { IndustryType, BusinessConfig } from '@/types/app.types'

// =============================================================================
// Validation Constants
// =============================================================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  BUSINESS_NAME_MIN_LENGTH: 2,
  BUSINESS_NAME_MAX_LENGTH: 100,
  USER_NAME_MIN_LENGTH: 2,
  USER_NAME_MAX_LENGTH: 100,
} as const

// =============================================================================
// UI Constants
// =============================================================================

export const UI = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
} as const

// =============================================================================
// Industry Constants
// =============================================================================

export const VALID_INDUSTRIES: readonly IndustryType[] = [
  'distributor',
  'retail',
  'grocery',
  'service',
] as const

// =============================================================================
// Default Module Configurations by Industry
// =============================================================================

export const DEFAULT_CONFIGS: Record<IndustryType, BusinessConfig> = {
  distributor: {
    modules: {
      stock: { enabled: true, variants: false, projections: true },
      orders: { enabled: true, recurring: true, tiered_pricing: true },
      deliveries: { enabled: true, type: 'own_routes' },
      billing: { enabled: true, current_account: true, auto_reminders: true },
    },
  },
  retail: {
    modules: {
      stock: { enabled: true, variants: true, projections: false },
      orders: { enabled: true, recurring: false, tiered_pricing: false },
      deliveries: { enabled: false },
      billing: { enabled: true, current_account: true, auto_reminders: true },
    },
  },
  grocery: {
    modules: {
      stock: { enabled: true, variants: false, projections: true },
      orders: { enabled: false },
      deliveries: { enabled: false },
      billing: { enabled: true, current_account: true, auto_reminders: false },
    },
  },
  service: {
    modules: {
      stock: { enabled: false },
      orders: { enabled: true, recurring: false, tiered_pricing: false },
      deliveries: { enabled: false },
      billing: { enabled: true, current_account: true, auto_reminders: true },
    },
  },
} as const

/**
 * Get the default configuration for an industry
 */
export function getDefaultConfig(industry: IndustryType): BusinessConfig {
  return DEFAULT_CONFIGS[industry] ?? DEFAULT_CONFIGS.distributor
}

/**
 * Check if an industry is valid
 */
export function isValidIndustry(industry: string): industry is IndustryType {
  return VALID_INDUSTRIES.includes(industry as IndustryType)
}
