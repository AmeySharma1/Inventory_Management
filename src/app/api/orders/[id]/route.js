import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

/** GET /api/orders/[id] — full detail with line items */
export async function GET(req, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isAdmin = session.role === "admin";
  const sql = getDb();

  const [order] = await sql`
    SELECT o.*, u.name AS seller_name, u.email AS seller_email,
           u.phone AS seller_phone, u.company AS seller_company
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.id = ${id}
      AND (${isAdmin} OR u.id = ${session.sub})
  `;
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });

  const items = await sql`
    SELECT oi.*, p.name AS product_name, p.sku, p.base_unit
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ${id}
    ORDER BY oi.id
  `;

  return Response.json({ order, items });
}

/** PATCH /api/orders/[id] — admin updates status */
export async function PATCH(req, { params }) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id }   = await params;
  const { status } = await req.json();
  const validStatuses = ["pending", "approved", "rejected", "shipped", "delivered"];

  if (!validStatuses.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const sql = getDb();
  const [order] = await sql`
    UPDATE orders SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ order });
}
