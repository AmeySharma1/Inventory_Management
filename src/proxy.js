import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "chemstock-fallback-secret-change-me"
);

// These paths never need authentication
function isPublic(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/db/")
  );
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Check session token
  const token = req.cookies.get("cs_token")?.value ?? null;
  let payload = null;

  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, SECRET);
      payload = p;
    } catch {
      // Invalid or expired token — clear cookie and redirect
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.delete("cs_token");
      return res;
    }
  }

  // Not authenticated → landing page
  if (!payload) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = payload.role;

  // Role-based route guards
  if (pathname.startsWith("/admin") && role !== "admin") {
    const dest = role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (pathname.startsWith("/seller") && role !== "seller") {
    const dest = role === "admin" ? "/admin/dashboard" : "/buyer/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  if (pathname.startsWith("/buyer") && role !== "buyer") {
    const dest = role === "admin" ? "/admin/dashboard" : "/seller/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
