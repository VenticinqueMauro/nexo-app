-- Nexo Seed Data
-- Sample data for development and testing

-- Note: Replace USER_ID_HERE with actual auth.users IDs after signup

-- =====================================================================
-- 1. Sample Business (Distribuidora)
-- =====================================================================

INSERT INTO businesses (id, name, industry, config) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Distribuidora El Sol',
  'distributor',
  '{
    "modules": {
      "stock": {"enabled": true, "variants": false, "projections": true},
      "orders": {"enabled": true, "recurring": true, "tiered_pricing": true},
      "deliveries": {"enabled": true, "type": "own_routes"},
      "billing": {"enabled": true, "current_account": true, "auto_reminders": true}
    }
  }'
),
(
  '00000000-0000-0000-0000-000000000002',
  'Boutique Fashion',
  'retail',
  '{
    "modules": {
      "stock": {"enabled": true, "variants": true, "projections": false},
      "orders": {"enabled": true, "recurring": false, "tiered_pricing": false},
      "deliveries": {"enabled": false},
      "billing": {"enabled": true, "current_account": true, "auto_reminders": true}
    }
  }'
);

-- =====================================================================
-- 2. Sample Products (Distribuidora)
-- =====================================================================

INSERT INTO products (id, business_id, name, description, category, base_price, has_variants, min_stock) VALUES
-- Gaseosas
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Coca Cola 2.25L', 'Gaseosa Cola 2.25 litros', 'Gaseosas', 4500.00, false, 20),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Sprite 2.25L', 'Gaseosa Lima-Limón 2.25 litros', 'Gaseosas', 4200.00, false, 15),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Fanta 2.25L', 'Gaseosa Naranja 2.25 litros', 'Gaseosas', 4200.00, false, 15),
-- Aguas
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Agua Mineral 2L', 'Agua mineral sin gas 2 litros', 'Aguas', 1800.00, false, 30),
-- Cervezas
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Quilmes 1L', 'Cerveza Quilmes 1 litro', 'Cervezas', 3200.00, false, 25);

-- =====================================================================
-- 3. Tiered Prices (Precios por cantidad)
-- =====================================================================

-- Coca Cola
INSERT INTO tiered_prices (product_id, min_quantity, max_quantity, price) VALUES
('10000000-0000-0000-0000-000000000001', 1, 10, 4500.00),
('10000000-0000-0000-0000-000000000001', 11, 50, 4200.00),
('10000000-0000-0000-0000-000000000001', 51, NULL, 3900.00);

-- Sprite
INSERT INTO tiered_prices (product_id, min_quantity, max_quantity, price) VALUES
('10000000-0000-0000-0000-000000000002', 1, 10, 4200.00),
('10000000-0000-0000-0000-000000000002', 11, 50, 3900.00),
('10000000-0000-0000-0000-000000000002', 51, NULL, 3600.00);

-- =====================================================================
-- 4. Sample Products (Retail - con variantes)
-- =====================================================================

INSERT INTO products (id, business_id, name, description, category, base_price, has_variants, min_stock) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Remera Básica', 'Remera de algodón lisa', 'Remeras', 15000.00, true, 5),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Jean Clásico', 'Jean corte clásico', 'Pantalones', 35000.00, true, 3);

-- Variantes de Remera Básica (colores y talles)
INSERT INTO product_variants (product_id, sku, attributes, stock) VALUES
('20000000-0000-0000-0000-000000000001', 'REM-NEGRA-S', '{"color": "Negro", "talle": "S"}', 10),
('20000000-0000-0000-0000-000000000001', 'REM-NEGRA-M', '{"color": "Negro", "talle": "M"}', 15),
('20000000-0000-0000-0000-000000000001', 'REM-NEGRA-L', '{"color": "Negro", "talle": "L"}', 12),
('20000000-0000-0000-0000-000000000001', 'REM-BLANCA-S', '{"color": "Blanco", "talle": "S"}', 8),
('20000000-0000-0000-0000-000000000001', 'REM-BLANCA-M', '{"color": "Blanco", "talle": "M"}', 20),
('20000000-0000-0000-0000-000000000001', 'REM-BLANCA-L', '{"color": "Blanco", "talle": "L"}', 10);

-- Variantes de Jean Clásico
INSERT INTO product_variants (product_id, sku, attributes, stock) VALUES
('20000000-0000-0000-0000-000000000002', 'JEAN-AZUL-38', '{"color": "Azul", "talle": "38"}', 5),
('20000000-0000-0000-0000-000000000002', 'JEAN-AZUL-40', '{"color": "Azul", "talle": "40"}', 8),
('20000000-0000-0000-0000-000000000002', 'JEAN-AZUL-42', '{"color": "Azul", "talle": "42"}', 6),
('20000000-0000-0000-0000-000000000002', 'JEAN-NEGRO-38', '{"color": "Negro", "talle": "38"}', 4),
('20000000-0000-0000-0000-000000000002', 'JEAN-NEGRO-40', '{"color": "Negro", "talle": "40"}', 7),
('20000000-0000-0000-0000-000000000002', 'JEAN-NEGRO-42', '{"color": "Negro", "talle": "42"}', 5);

-- =====================================================================
-- 5. Sample Customers (Distribuidora)
-- =====================================================================

INSERT INTO customers (id, business_id, name, phone, address, payment_behavior, usual_order) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Kiosco López',
  '+54 11 1234-5678',
  'Av. Mitre 450',
  'excellent',
  '{
    "items": [
      {"product_id": "10000000-0000-0000-0000-000000000001", "quantity": 20},
      {"product_id": "10000000-0000-0000-0000-000000000002", "quantity": 10},
      {"product_id": "10000000-0000-0000-0000-000000000003", "quantity": 10}
    ]
  }'
),
(
  '30000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Almacén Pérez',
  '+54 11 2345-6789',
  'Calle Falsa 123',
  'good',
  '{
    "items": [
      {"product_id": "10000000-0000-0000-0000-000000000001", "quantity": 30},
      {"product_id": "10000000-0000-0000-0000-000000000004", "quantity": 20}
    ]
  }'
),
(
  '30000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Don Mario',
  '+54 11 3456-7890',
  'Av. Libertador 890',
  'regular',
  NULL
);

-- =====================================================================
-- 6. Initial Stock Movements (Distribuidora)
-- =====================================================================

INSERT INTO stock_movements (business_id, product_id, quantity, type, notes) VALUES
-- Stock inicial
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 200, 'purchase', 'Stock inicial'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 150, 'purchase', 'Stock inicial'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 150, 'purchase', 'Stock inicial'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 300, 'purchase', 'Stock inicial'),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 180, 'purchase', 'Stock inicial');

-- =====================================================================
-- NOTES
-- =====================================================================

-- To add users, first create them in Supabase Auth, then insert into users table:
-- INSERT INTO users (id, business_id, email, role, name) VALUES
-- ('AUTH_USER_ID', 'BUSINESS_ID', 'email@example.com', 'owner', 'Full Name');
