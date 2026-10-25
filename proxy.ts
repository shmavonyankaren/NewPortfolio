import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySession } from "./lib/auth/session";
const internationalize = createMiddleware(routing);
export function proxy(request: NextRequest) {
 const path = request.nextUrl.pathname;
 if (path.startsWith("/admin-dashboard") || path === "/login") {
  const authenticated = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (path.startsWith("/admin-dashboard") && !authenticated) return NextResponse.redirect(new URL("/login", request.url));
  if (path === "/login" && authenticated) return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  return NextResponse.next();
 }
 if (/^\/(?:en|de)(?:\/|$)/.test(path)) return internationalize(request);
 if (/^\/(?:about|contact|posts|projects(?:\/[^/]+)?)?\/?$/.test(path)) {
  const url = request.nextUrl.clone();
  url.pathname = "/en" + (path === "/" ? "" : path);
  return NextResponse.redirect(url, 308);
 }
 return NextResponse.next();
}
export const config = { matcher: ["/((?!api|_next|monitoring|.*\\..*).*)"] };
