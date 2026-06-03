import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const users = await sql`
    SELECT
      u.id, u.email, u.name, u.role,
      u.phone, u.company, u.is_active, u.created_at,
      COUNT(DISTINCT o.id)::int        AS total_orders,
      COALESCE(SUM(o.total_inr), 0)    AS total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'draft'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  return Response.json({ users });
}
