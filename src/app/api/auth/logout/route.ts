import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/auth/cookies";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const sessionCookie = request.cookies.get(getSessionCookieName())?.value;

  if (sessionCookie) {
    try {
      const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, false);
      await getFirebaseAdminAuth().revokeRefreshTokens(decoded.uid);
    } catch {
      // Fail closed by clearing the cookie even if revocation verification fails.
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieOptions(0),
    expires: new Date(0),
  });
  return response;
}
