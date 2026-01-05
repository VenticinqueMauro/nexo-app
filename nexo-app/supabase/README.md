# Nexo - Supabase Database Setup

This directory contains all the database schema, policies, and seed data for the Nexo application.

## Files Overview

- **schema.sql** - Complete database schema with tables, indexes, functions, and views
- **rls-policies.sql** - Row Level Security policies for multi-tenant data isolation
- **seed.sql** - Sample data for development and testing

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Fill in your project details:
   - Name: `nexo-app` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to your location
4. Wait for the project to be created (~2 minutes)

### 2. Get Your Project Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: The public API key
   - **service_role key**: The secret key (keep this secure!)

### 3. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run the Database Migrations

You have two options to run the SQL files:

#### Option A: Using Supabase Dashboard (Recommended for first setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query
4. Copy the contents of `schema.sql` and paste it
5. Click "Run" to execute
6. Repeat for `rls-policies.sql`
7. (Optional) Run `seed.sql` for sample data

#### Option B: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push --file supabase/schema.sql
   supabase db push --file supabase/rls-policies.sql
   # Optional: Load seed data
   supabase db push --file supabase/seed.sql
   ```

### 5. Enable Email Auth (Optional but Recommended)

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### 6. Generate TypeScript Types

After running the schema, generate TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
```

Or via the Supabase CLI if linked:

```bash
supabase gen types typescript --linked > types/database.types.ts
```

## Database Architecture

### Multi-Tenant Design

The database uses a multi-tenant architecture where:
- All data is partitioned by `business_id`
- Row Level Security (RLS) ensures complete data isolation
- Each user belongs to one business
- Users can only access data from their business

### Core Tables

1. **businesses** - Root table for each tenant/business
2. **users** - System users with roles (owner, seller, warehouse, driver)
3. **products** - Product catalog (with optional variants)
4. **product_variants** - Product variations (size, color, etc.)
5. **customers** - Customer database
6. **orders** - Orders/Sales
7. **order_items** - Line items for orders
8. **payments** - Payment transactions
9. **stock_movements** - Inventory movements
10. **deliveries** - Delivery management (optional module)
11. **notifications** - System notifications

### Roles and Permissions

| Role | Permissions |
|------|-------------|
| **owner** | Full access to everything in their business |
| **seller** | Can manage customers, orders, payments. Read-only on stock |
| **warehouse** | Can manage stock, products. Read-only on orders |
| **driver** | Can only view and update their assigned deliveries |

### Industry-Specific Configuration

Each business has a `config` JSONB field that enables/disables modules:

```json
{
  "modules": {
    "stock": {
      "enabled": true,
      "variants": false,
      "projections": true
    },
    "orders": {
      "enabled": true,
      "recurring": true,
      "tiered_pricing": true
    },
    "deliveries": {
      "enabled": true,
      "type": "own_routes"
    },
    "billing": {
      "enabled": true,
      "current_account": true,
      "auto_reminders": true
    }
  }
}
```

## Useful Views

The schema includes helpful views:

- **products_with_stock** - Products with current stock and low stock indicators
- **customer_balances** - Customer accounts with total debt

Example query:
```sql
SELECT * FROM products_with_stock WHERE is_low_stock = true;
SELECT * FROM customer_balances WHERE balance > 0 ORDER BY balance DESC;
```

## Functions

### Helper Functions

- `auth.get_user_business_id()` - Returns current user's business ID
- `calculate_order_total(order_uuid)` - Calculates total for an order
- `get_customer_balance(customer_uuid)` - Gets customer's current debt
- `update_updated_at_column()` - Auto-updates updated_at timestamp

## Testing Your Setup

After running all migrations, test that everything works:

```sql
-- Check that tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- If you loaded seed data, check it
SELECT * FROM businesses;
SELECT * FROM products;
SELECT * FROM customers;
```

## Troubleshooting

### "permission denied for table X"
- Make sure RLS policies are applied
- Check that you're authenticated
- Verify user exists in the `users` table with correct `business_id`

### "relation X does not exist"
- Run schema.sql first before rls-policies.sql
- Check for any SQL errors in the output

### Types not matching
- Re-generate TypeScript types after schema changes
- Restart your Next.js dev server

## Next Steps

1. Create your first user via Supabase Auth
2. Insert that user into the `users` table with a business
3. Test authentication in your Next.js app
4. Start building the UI components

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
