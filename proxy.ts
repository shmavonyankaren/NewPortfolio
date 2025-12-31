import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdmin = request.cookies.get("isAdmin")?.value === "true";

  // Protect admin-dashboard route
  if (pathname.startsWith("/admin-dashboard")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect to admin-dashboard if already logged in and trying to access login
  if (pathname === "/login") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)",
  ],
};
