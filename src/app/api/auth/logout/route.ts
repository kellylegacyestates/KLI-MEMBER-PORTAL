import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/auth/cookies";
import { isTrustedOrigin } from "@/lib/auth/request-safety";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  // Clear the current-session HTTP-only cookie only.
  // This signs the user out of this browser without touching other active
  // devices or globally revoking Firebase refresh tokens.
  //
  // Future: a separate "Sign out all devices" action can call
  // getFirebaseAdminAuth().revokeRefreshTokens(uid) after verifying the
  // session cookie and confirming explicit user intent.

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieOptions(0),
    expires: new Date(0),
  });
  return response;
}
