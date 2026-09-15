import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define route categories
const PUBLIC_ROUTES = ["/", "/login", "/register", "/courts"];
const AUTH_ROUTES = ["/reservations", "/reservation"];
const ADMIN_ROUTES = [
  "/admin",
  "/admin/courts",
  "/admin/time-slots",
  "/admin/reservations",
  "/admin/users",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and role from cookies
  const token = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;

  const isAuthenticated = Boolean(token);
  const isAdmin = userRole === "admin";

  // 1. Redirect authenticated users away from Login / Register pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/reservations", request.url));
  }

  // 2. Protect Admin Routes (Requires authentication AND Admin role)
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Authenticated but non-admin user trying to access admin pages
      return NextResponse.redirect(new URL("/reservations", request.url));
    }
  }

  // 3. Protect Customer Authenticated Routes (Requires authentication)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};