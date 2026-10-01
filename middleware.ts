import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const expectedToken = process.env.ADMIN_SESSION_TOKEN || "admin_logged_in_token";

  // If trying to access dashboard without valid session, send to /login
  if (!isLoginPage && sessionToken !== expectedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already authenticated and visiting /login, send to dashboard
  if (isLoginPage && sessionToken === expectedToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};