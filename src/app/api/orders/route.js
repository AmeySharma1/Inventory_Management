import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

const TO_BASE = { g: 1, kg: 1000, mL: 1, L: 1000, unit: 1 };

export async function GET(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const sql = getDb();

  if (session.role === "admin") {
    const orders = await sql`
      SELECT o.*, u.name AS seller_name, u.email AS seller_email,
             COUNT(oi.id)::int AS item_count
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE (${status} = '' OR o.status = ${status})
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC LIMIT 100
    `;
    return Response.json({ orders });
  }

  const orders = await sql`
    SELECT o.*, COUNT(oi.id)::int AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ${Number(session.sub)}
      AND (${status} = '' OR o.status = ${status})
    GROUP BY o.id
    ORDER BY o.created_at DESC LIMIT 50
  `;
  return Response.json({ orders });
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body = {};
  try { body = await req.json(); } catch {}
  const { items, notes } = body;
  if (!items?.length) return Response.json({ error: "No items" }, { status: 400 });

  const sql = getDb();
  const productIds = items.map((i) => Number(i.product_id));
  const products = await sql`
    SELECT id, base_price, base_unit FROM products WHERE id = ANY(${productIds})
  `;
  const pMap = Object.fromEntries(products.map((p) => [String(p.id), p]));

  let totalInr = 0;
  const lines = [];
  for (const item of items) {
    const p = pMap[String(item.product_id)];
    if (!p) return Response.json({ error: `Product ${item.product_id} not found` }, { status: 400 });
    const factor  = TO_BASE[item.ordered_unit] ?? 1;
    const qtyBase = parseFloat(item.ordered_qty) * factor;
    const lineTotal = qtyBase * parseFloat(p.base_price);
    totalInr += lineTotal;
    lines.push({
      product_id:          Number(item.product_id),
      ordered_unit:        item.ordered_unit,
      ordered_qty_display: parseFloat(item.ordered_qty),
      quantity_base:       qtyBase,
      unit_price_inr:      parseFloat(p.base_price),
      line_total_inr:      lineTotal,
    });
  }

  // Generate ref using DB sequence
  const seqRows = await sql`SELECT nextval('orders_id_seq') AS nv`;
  const seqVal  = seqRows[0].nv;
  const ref = `QUO-${new Date().getFullYear()}-${String(seqVal).padStart(4, "0")}`;

  const [order] = await sql`
    INSERT INTO orders (id, ref, user_id, notes, total_inr)
    VALUES (${seqVal}, ${ref}, ${Number(session.sub)}, ${notes ?? null}, ${totalInr})
    RETURNING *
  `;

  for (const line of lines) {
    await sql`
      INSERT INTO order_items
        (order_id, product_id, ordered_unit, ordered_qty_display, quantity_base, unit_price_inr, line_total_inr)
      VALUES
        (${order.id}, ${line.product_id}, ${line.ordered_unit},
         ${line.ordered_qty_display}, ${line.quantity_base},
         ${line.unit_price_inr}, ${line.line_total_inr})
    `;
  }

  return Response.json({ order }, { status: 201 });
}
