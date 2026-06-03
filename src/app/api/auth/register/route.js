import { getDb } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/register
 * Body: { name, email, password, role, adminSecret? }
 * Roles: "seller" | "buyer" | "admin"
 */
export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}

  const { name = "", email = "", password = "", role = "seller", adminSecret = "" } = body;

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (!["seller", "buyer", "admin"].includes(role)) {
    return Response.json({ error: "Invalid role." }, { status: 400 });
  }

  // Admin secret check
  if (role === "admin") {
    const secret = process.env.ADMIN_SECRET ?? "chemstock-admin-2026";
    if (adminSecret !== secret) {
      return Response.json({ error: "Incorrect admin passphrase." }, { status: 403 });
    }
  }

  const sql = getDb();

  // Check duplicate email
  const [existing] = await sql`SELECT id FROM users WHERE email = LOWER(${email.trim()})`;
  if (existing) {
    return Response.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);

  const [user] = await sql`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (LOWER(${email.trim()}), ${hash}, ${name.trim()}, ${role})
    RETURNING id, email, name, role, is_active, created_at
  `;

  await createSession(user);

  return Response.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201 });
}
