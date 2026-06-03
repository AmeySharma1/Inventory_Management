import { getDb } from "@/lib/db";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch {}

  const { email = "", password = "" } = body;

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const sql = getDb();
  const [user] = await sql`
    SELECT id, email, name, role, password_hash, is_active
    FROM users
    WHERE email = LOWER(${email.trim()})
  `;

  if (!user) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }
  if (!user.is_active) {
    return Response.json({ error: "This account has been deactivated." }, { status: 403 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(user);

  return Response.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
