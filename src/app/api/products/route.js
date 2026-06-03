import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

/** GET /api/products — public to authenticated users */
export async function GET(req) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search    = searchParams.get("search")   ?? "";
  const category  = searchParams.get("category") ?? "";
  const activeOnly = searchParams.get("active") !== "false";

  const sql = getDb();
  const products = await sql`
    SELECT p.*, c.name AS category_name, u.name AS seller_name, u.company AS seller_company
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN users u ON u.id = p.seller_id
    WHERE
      (${search} = '' OR p.name ILIKE ${"%" + search + "%"} OR p.sku ILIKE ${"%" + search + "%"})
      AND (${category} = '' OR c.name = ${category})
      AND (${activeOnly} = FALSE OR p.is_active = TRUE)
    ORDER BY p.name
  `;
  return Response.json({ products });
}

/** POST /api/products — sellers and admin can create */
export async function POST(req) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "seller")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, sku, description, category_id, base_unit, base_price, stock_quantity, low_stock_threshold } = body;

  if (!name || !sku || !base_unit || base_price == null) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  const sellerId = session.role === "seller" ? Number(session.sub) : (body.seller_id ?? null);
  
  const [product] = await sql`
    INSERT INTO products (seller_id, name, sku, description, category_id, base_unit, base_price, stock_quantity, low_stock_threshold)
    VALUES (
      ${sellerId}, ${name}, ${sku}, ${description ?? null}, ${category_id ?? null},
      ${base_unit}, ${base_price}, ${stock_quantity ?? 0}, ${low_stock_threshold ?? 0}
    )
    RETURNING *
  `;
  return Response.json({ product }, { status: 201 });
}
