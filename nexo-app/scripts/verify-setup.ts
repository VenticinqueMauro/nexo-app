/**
 * Verify Supabase Setup
 *
 * This script verifies that Supabase is configured correctly and the database
 * schema is properly set up.
 *
 * Run with: npm run verify-setup
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifySetup() {
  console.log('🔍 Verifying Nexo Supabase Setup...\n')

  // Test 1: Connection
  console.log('1️⃣  Testing database connection...')
  try {
    const { error } = await supabase.from('businesses').select('count').single()
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, which is fine
      console.error('❌ Connection failed:', error.message)
      return false
    }
    console.log('✅ Database connection successful\n')
  } catch (error) {
    console.error('❌ Connection failed:', error)
    return false
  }

  // Test 2: Check tables exist
  console.log('2️⃣  Checking if tables exist...')
  const requiredTables = [
    'businesses',
    'users',
    'products',
    'product_variants',
    'tiered_prices',
    'customers',
    'orders',
    'order_items',
    'payments',
    'stock_movements',
    'deliveries',
    'notifications'
  ]

  let allTablesExist = true
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table as any).select('count').limit(0)
      if (error && !error.message.includes('JWT')) {
        console.log(`❌ Table '${table}' not found or not accessible`)
        allTablesExist = false
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    } catch (error) {
      console.log(`❌ Table '${table}' check failed`)
      allTablesExist = false
    }
  }

  if (!allTablesExist) {
    console.log('\n⚠️  Some tables are missing. Have you run the schema.sql file?')
    return false
  }

  console.log('\n3️⃣  Checking sample data...')
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('*')

  if (businessError) {
    console.log('⚠️  Could not query businesses:', businessError.message)
  } else if (businesses && businesses.length > 0) {
    console.log(`✅ Found ${businesses.length} business(es) in database`)
    businesses.forEach((b: any) => {
      console.log(`   - ${b.name} (${b.industry})`)
    })
  } else {
    console.log('ℹ️  No businesses found (this is OK for a fresh setup)')
    console.log('   You can load sample data by running: supabase/seed.sql')
  }

  console.log('\n✨ Setup verification complete!')
  console.log('\nNext steps:')
  console.log('1. Run the database migrations (see supabase/README.md)')
  console.log('2. Create your first user via Supabase Auth')
  console.log('3. Insert that user into the users table')
  console.log('4. Start building! npm run dev')

  return true
}

verifySetup().then(success => {
  process.exit(success ? 0 : 1)
})
