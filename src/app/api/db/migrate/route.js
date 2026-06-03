import { neon } from "@neondatabase/serverless";

/**
 * GET /api/db/migrate
 * Runs schema against Neon. No auth required (DB might not exist yet).
 */
export async function GET(req) {
  const secret = new URL(req.url).searchParams.get("secret");
  const expected = process.env.MIGRATE_SECRET ?? "migrate-2026";

  if (process.env.NODE_ENV === "production" && secret !== expected) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);
  const results = [];

  async function run(label, fn) {
    try {
      await fn();
      results.push({ ok: true, label });
    } catch (e) {
      results.push({ ok: false, label, error: e.message });
    }
  }

  await run("users table", () => sql`
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
    )
  `);

  await run("categories table", () => sql`
    CREATE TABLE IF NOT EXISTS categories (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL UNIQUE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await run("products table", () => sql`
    CREATE TABLE IF NOT EXISTS products (
      id                   SERIAL PRIMARY KEY,
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
    )
  `);

  await run("orders table", () => sql`
    CREATE TABLE IF NOT EXISTS orders (
      id          SERIAL PRIMARY KEY,
      ref         TEXT           NOT NULL UNIQUE,
      user_id     INT            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      status      TEXT           NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('draft','pending','approved','rejected','shipped','delivered')),
      notes       TEXT,
      total_inr   NUMERIC(20,10) NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
    )
  `);

  await run("orders_id_seq sequence", () => sql`
    CREATE SEQUENCE IF NOT EXISTS orders_id_seq
  `);

  await run("order_items table", () => sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id                   SERIAL PRIMARY KEY,
      order_id             INT            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id           INT            NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
      ordered_unit         TEXT           NOT NULL,
      ordered_qty_display  NUMERIC(20,10) NOT NULL,
      quantity_base        NUMERIC(20,10) NOT NULL,
      unit_price_inr       NUMERIC(20,10) NOT NULL,
      line_total_inr       NUMERIC(20,10) NOT NULL,
      created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
    )
  `);

  await run("add seller_id to products", () => sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS seller_id INT NOT NULL DEFAULT 1
      REFERENCES users(id) ON DELETE CASCADE
  `);

  await run("index: users email", () => sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
  await run("index: orders user", () => sql`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);
  await run("index: orders status", () => sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
  await run("index: order_items order", () => sql`CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items(order_id)`);
  await run("index: products seller", () => sql`CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id)`);

  await run("seed categories", () => sql`
    INSERT INTO categories (name) VALUES
      ('Acids'),('Bases'),('Solvents'),('Salts'),
      ('Indicators'),('Reagents'),('Sugars'),('Other')
    ON CONFLICT (name) DO NOTHING
  `);

  return Response.json({ ok: true, results });
}
