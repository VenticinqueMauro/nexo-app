-- Nexo Multi-Tenant Row Level Security Policies
-- Ensures complete data isolation between businesses

-- =====================================================================
-- HELPER FUNCTION: Get current user's business_id
-- Note: This function is in the public schema, not auth schema
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================================
-- 1. BUSINESSES
-- =====================================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own business
CREATE POLICY "Users can view their own business"
  ON businesses FOR SELECT
  USING (id = get_user_business_id());

-- Only owners can update their business
CREATE POLICY "Owners can update their business"
  ON businesses FOR UPDATE
  USING (
    id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- =====================================================================
-- 2. USERS
-- =====================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view other users in their business
CREATE POLICY "Users can view users in their business"
  ON users FOR SELECT
  USING (business_id = get_user_business_id());

-- Owners can insert new users in their business
CREATE POLICY "Owners can insert users in their business"
  ON users FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- Owners can update users in their business
CREATE POLICY "Owners can update users in their business"
  ON users FOR UPDATE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- =====================================================================
-- 3. PRODUCTS
-- =====================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- All users can view products in their business
CREATE POLICY "Users can view products in their business"
  ON products FOR SELECT
  USING (business_id = get_user_business_id());

-- Owners and warehouse can insert products
CREATE POLICY "Owners and warehouse can insert products"
  ON products FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

-- Owners and warehouse can update products
CREATE POLICY "Owners and warehouse can update products"
  ON products FOR UPDATE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

-- Only owners can delete products
CREATE POLICY "Owners can delete products"
  ON products FOR DELETE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- =====================================================================
-- 4. PRODUCT VARIANTS
-- =====================================================================

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- All users can view variants of products in their business
CREATE POLICY "Users can view variants in their business"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_variants.product_id
      AND products.business_id = get_user_business_id()
    )
  );

-- Owners and warehouse can manage variants
CREATE POLICY "Owners and warehouse can insert variants"
  ON product_variants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      JOIN users ON users.business_id = products.business_id
      WHERE products.id = product_variants.product_id
      AND users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

CREATE POLICY "Owners and warehouse can update variants"
  ON product_variants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN users ON users.business_id = products.business_id
      WHERE products.id = product_variants.product_id
      AND users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

-- =====================================================================
-- 5. TIERED PRICES
-- =====================================================================

ALTER TABLE tiered_prices ENABLE ROW LEVEL SECURITY;

-- All users can view tiered prices
CREATE POLICY "Users can view tiered prices in their business"
  ON tiered_prices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = tiered_prices.product_id
      AND products.business_id = get_user_business_id()
    )
  );

-- Owners can manage tiered prices
CREATE POLICY "Owners can manage tiered prices"
  ON tiered_prices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN users ON users.business_id = products.business_id
      WHERE products.id = tiered_prices.product_id
      AND users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- =====================================================================
-- 6. CUSTOMERS
-- =====================================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- All users (except drivers) can view customers
CREATE POLICY "Users can view customers in their business"
  ON customers FOR SELECT
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller', 'warehouse')
    )
  );

-- Owners and sellers can insert customers
CREATE POLICY "Owners and sellers can insert customers"
  ON customers FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller')
    )
  );

-- Owners and sellers can update customers
CREATE POLICY "Owners and sellers can update customers"
  ON customers FOR UPDATE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller')
    )
  );

-- =====================================================================
-- 7. ORDERS
-- =====================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- All users can view orders in their business
CREATE POLICY "Users can view orders in their business"
  ON orders FOR SELECT
  USING (business_id = get_user_business_id());

-- Owners, sellers, and warehouse can insert orders
CREATE POLICY "Owners, sellers, warehouse can insert orders"
  ON orders FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller', 'warehouse')
    )
  );

-- Owners, sellers, warehouse can update orders
CREATE POLICY "Owners, sellers, warehouse can update orders"
  ON orders FOR UPDATE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller', 'warehouse')
    )
  );

-- =====================================================================
-- 8. ORDER ITEMS
-- =====================================================================

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items from their business
CREATE POLICY "Users can view order items in their business"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.business_id = get_user_business_id()
    )
  );

-- Owners, sellers, warehouse can manage order items
CREATE POLICY "Owners, sellers, warehouse can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      JOIN users ON users.business_id = orders.business_id
      WHERE orders.id = order_items.order_id
      AND users.id = auth.uid()
      AND users.role IN ('owner', 'seller', 'warehouse')
    )
  );

CREATE POLICY "Owners, sellers, warehouse can update order items"
  ON order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN users ON users.business_id = orders.business_id
      WHERE orders.id = order_items.order_id
      AND users.id = auth.uid()
      AND users.role IN ('owner', 'seller', 'warehouse')
    )
  );

-- =====================================================================
-- 9. PAYMENTS
-- =====================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view payments in their business
CREATE POLICY "Users can view payments in their business"
  ON payments FOR SELECT
  USING (business_id = get_user_business_id());

-- Owners and sellers can insert payments
CREATE POLICY "Owners and sellers can insert payments"
  ON payments FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'seller')
    )
  );

-- Only owners can delete payments
CREATE POLICY "Owners can delete payments"
  ON payments FOR DELETE
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'owner'
    )
  );

-- =====================================================================
-- 10. STOCK MOVEMENTS
-- =====================================================================

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- All users can view stock movements
CREATE POLICY "Users can view stock movements in their business"
  ON stock_movements FOR SELECT
  USING (business_id = get_user_business_id());

-- Owners and warehouse can insert stock movements
CREATE POLICY "Owners and warehouse can insert stock movements"
  ON stock_movements FOR INSERT
  WITH CHECK (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

-- =====================================================================
-- 11. DELIVERIES
-- =====================================================================

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Users can view deliveries in their business
CREATE POLICY "Users can view deliveries in their business"
  ON deliveries FOR SELECT
  USING (business_id = get_user_business_id());

-- Drivers can only see their assigned deliveries
CREATE POLICY "Drivers can view their assigned deliveries"
  ON deliveries FOR SELECT
  USING (
    driver_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
      AND users.business_id = deliveries.business_id
    )
  );

-- Owners and warehouse can manage deliveries
CREATE POLICY "Owners and warehouse can manage deliveries"
  ON deliveries FOR ALL
  USING (
    business_id = get_user_business_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('owner', 'warehouse')
    )
  );

-- Drivers can update their delivery status
CREATE POLICY "Drivers can update their delivery status"
  ON deliveries FOR UPDATE
  USING (driver_id = auth.uid())
  WITH CHECK (driver_id = auth.uid());

-- =====================================================================
-- 12. NOTIFICATIONS
-- =====================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (
    business_id = get_user_business_id()
    AND (user_id = auth.uid() OR user_id IS NULL)
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (business_id = get_user_business_id());
