/**
 * Database Types
 *
 * These types will be auto-generated from the Supabase database schema
 * using the Supabase CLI command: npx supabase gen types typescript
 *
 * For now, this is a placeholder. Once the database schema is created,
 * run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tables will be defined here after schema creation
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
  }
}
