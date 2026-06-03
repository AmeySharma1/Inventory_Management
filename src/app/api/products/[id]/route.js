import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

/** PATCH /api/products/[id] — admin only */
export async function PATCH(req, { params }) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, sku, description, category_id, base_unit, base_price, stock_quantity, low_stock_threshold, is_active } = body;
  const sql = getDb();

  const [product] = await sql`
    UPDATE products SET
      name                = COALESCE(${name               ?? null}, name),
      sku                 = COALESCE(${sku                ?? null}, sku),
      description         = COALESCE(${description        ?? null}, description),
      category_id         = COALESCE(${category_id        ?? null}, category_id),
      base_unit           = COALESCE(${base_unit          ?? null}, base_unit),
      base_price          = COALESCE(${base_price         ?? null}, base_price),
      stock_quantity      = COALESCE(${stock_quantity      ?? null}, stock_quantity),
      low_stock_threshold = COALESCE(${low_stock_threshold ?? null}, low_stock_threshold),
      is_active           = COALESCE(${is_active          ?? null}, is_active),
      updated_at          = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ product });
}

/** DELETE /api/products/[id] — admin only (soft delete) */
export async function DELETE(req, { params }) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const sql = getDb();
  await sql`UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = ${id}`;
  return Response.json({ ok: true });
}
