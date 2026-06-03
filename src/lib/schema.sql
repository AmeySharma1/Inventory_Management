-- ChemStock Database Schema
-- Run once via: GET /api/db/migrate

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          TEXT           NOT NULL UNIQUE,
  password_hash  TEXT           NOT NULL,
  name           TEXT           NOT NULL DEFAULT '',
  role           TEXT           NOT NULL DEFAULT 'seller'
                   CHECK (role IN ('admin', 'seller', 'buyer')),
  phone          TEXT,
  company        TEXT,
  is_active      BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id                   SERIAL PRIMARY KEY,
  seller_id            INT            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                 TEXT           NOT NULL,
  sku                  TEXT           NOT NULL UNIQUE,
  description          TEXT,
  category_id          INT            REFERENCES categories(id) ON DELETE SET NULL,
  base_unit            TEXT           NOT NULL CHECK (base_unit IN ('g','mL','unit')),
  base_price           NUMERIC(20,10) NOT NULL CHECK (base_price >= 0),
  stock_quantity       NUMERIC(20,10) NOT NULL DEFAULT 0,
  low_stock_threshold  NUMERIC(20,10) NOT NULL DEFAULT 0,
  is_active            BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);

CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  ref        TEXT           NOT NULL UNIQUE,
  user_id    INT            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status     TEXT           NOT NULL DEFAULT 'pending'
               CHECK (status IN ('draft','pending','approved','rejected','shipped','delivered')),
  notes      TEXT,
  total_inr  NUMERIC(20,10) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id                  SERIAL PRIMARY KEY,
  order_id            INT            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id          INT            NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  ordered_unit        TEXT           NOT NULL,
  ordered_qty_display NUMERIC(20,10) NOT NULL,
  quantity_base       NUMERIC(20,10) NOT NULL,
  unit_price_inr      NUMERIC(20,10) NOT NULL,
  line_total_inr      NUMERIC(20,10) NOT NULL,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_oi_order      ON order_items(order_id);

INSERT INTO categories (name) VALUES
  ('Acids'),('Bases'),('Solvents'),('Salts'),
  ('Indicators'),('Reagents'),('Sugars'),('Other')
ON CONFLICT (name) DO NOTHING;
