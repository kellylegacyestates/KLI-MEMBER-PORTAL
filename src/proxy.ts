import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName } from "@/lib/auth/cookies";
import { isProtectedPath } from "@/lib/auth/routes";

// Proxy performs only a coarse cookie-presence redirect. Trusted authorization
// still happens later in server components and route handlers with the Admin SDK.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(getSessionCookieName())?.value);

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*",
    "/curriculum/:path*",
    "/briefings/:path*",
    "/bookmarks/:path*",
    "/notes/:path*",
    "/downloads/:path*",
    "/certificates/:path*",
    "/billing/:path*",
    "/profile/:path*",
    "/account/:path*",
    "/library/:path*",
    "/research-library/:path*",
    "/standing-ledger/:path*",
    "/support/:path*",
    "/executive/:path*",
    "/admin/:path*",
  ],
};
