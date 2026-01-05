/**
 * Application configuration constants
 * Centralizes all hardcoded values for easier maintenance
 */

import type { IndustryType, BusinessConfig } from '@/types/app.types'
import type { SubscriptionConfig } from '@/types/modules.types'
import { generateDefaultModulesConfig } from './modules'

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
// Development Subscription (All features enabled)
// =============================================================================

export const DEV_SUBSCRIPTION: SubscriptionConfig = {
  plan: 'enterprise',
  status: 'active',
  bypassRestrictions: true,
}

// =============================================================================
// Default Business Configurations by Industry
// =============================================================================

/**
 * Get the default configuration for an industry
 * Uses the module system to generate appropriate defaults
 */
export function getDefaultConfig(industry: IndustryType): BusinessConfig {
  return {
    modules: generateDefaultModulesConfig(industry),
    subscription: DEV_SUBSCRIPTION, // For development, all features enabled
    contact: {},
    preferences: {
      currency: 'ARS',
      timezone: 'America/Argentina/Buenos_Aires',
      dateFormat: 'DD/MM/YYYY',
      language: 'es',
    },
  }
}

/**
 * Check if an industry is valid
 */
export function isValidIndustry(industry: string): industry is IndustryType {
  return VALID_INDUSTRIES.includes(industry as IndustryType)
}

// =============================================================================
// Feature Flags (for gradual rollout)
// =============================================================================

export const FEATURES = {
  // Enable/disable features globally during development
  ENABLE_AI_FEATURES: false,         // AI-powered features (inventory prediction, etc.)
  ENABLE_GOOGLE_PLACES: false,       // Google Places integration
  ENABLE_ROUTE_OPTIMIZATION: false,  // Route optimization
  ENABLE_MULTI_WAREHOUSE: false,     // Multi-warehouse support

  // Always enabled
  ENABLE_CURRENT_ACCOUNT: true,      // Cuenta corriente (fiado)
  ENABLE_VARIANTS: true,             // Product variants
  ENABLE_TIERED_PRICING: true,       // Tiered pricing
} as const
