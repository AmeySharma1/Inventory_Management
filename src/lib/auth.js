import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "chemstock-fallback-secret-change-me"
);
const COOKIE = "cs_token";

/** Create a signed JWT for a user and set it as an httpOnly cookie */
export async function createSession(user) {
  const token = await new SignJWT({
    sub:   String(user.id),
    email: user.email,
    name:  user.name  ?? "",
    role:  user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

/** Verify the JWT cookie and return the payload, or null */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // { sub, email, name, role }
  } catch {
    return null;
  }
}

/** Delete the session cookie */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
