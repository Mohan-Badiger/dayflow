import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login"];
const apiAuthPrefix = "/api/auth";

const rateLimit = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const limit = 100; // requests per window
  const windowMs = 60_000; // 1 minute
  const entry = rateLimit.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    rateLimit.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  rateLimit.set(ip, entry);
  return false;
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rate Limiting on API endpoints
  const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
  if (nextUrl.pathname.startsWith("/api/")) {
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some(p => 
    nextUrl.pathname === p || nextUrl.pathname.startsWith(p + "/")
  );
  const isAuthRoute = nextUrl.pathname === "/login";

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/today", nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
