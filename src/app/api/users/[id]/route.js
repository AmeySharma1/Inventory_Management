import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin" ? s : null;
}

export async function GET(req, { params }) {
  if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const sql = getDb();

  const [user] = await sql`
    SELECT u.*,
      COUNT(DISTINCT o.id)::int     AS total_orders,
      COALESCE(SUM(o.total_inr), 0) AS total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.id = ${id}
    GROUP BY u.id
  `;
  if (!user) return Response.json({ error: "Not found" }, { status: 404 });

  const orders = await sql`
    SELECT o.id, o.ref, o.status, o.total_inr, o.created_at,
           COUNT(oi.id)::int AS item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ${id}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 20
  `;

  return Response.json({ user, orders });
}

export async function PATCH(req, { params }) {
  if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { name, role, phone, company, is_active } = await req.json();
  const sql = getDb();

  const [updated] = await sql`
    UPDATE users SET
      name      = COALESCE(${name      ?? null}, name),
      role      = COALESCE(${role      ?? null}, role),
      phone     = COALESCE(${phone     ?? null}, phone),
      company   = COALESCE(${company   ?? null}, company),
      is_active = COALESCE(${is_active ?? null}, is_active),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, email, name, role, phone, company, is_active, created_at
  `;
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ user: updated });
}

export async function DELETE(req, { params }) {
  if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const sql = getDb();
  await sql`UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id = ${id}`;
  return Response.json({ ok: true });
}
