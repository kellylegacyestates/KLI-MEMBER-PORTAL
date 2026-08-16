import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/auth/cookies";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type LogoutFailureReason =
  | "LOGOUT_REJECT_ORIGIN"
  | "LOGOUT_REVOKE_FAILED"
  | "LOGOUT_COOKIE_CLEAR_FAILED"
  | "LOGOUT_UNKNOWN";

function logLogoutFailure(reason: LogoutFailureReason) {
  console.warn({ reason });
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieOptions(0),
    expires: new Date(0),
  });
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    logLogoutFailure("LOGOUT_REJECT_ORIGIN");
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const sessionCookie = request.cookies.get(getSessionCookieName())?.value;

  if (sessionCookie) {
    try {
      const auth = getFirebaseAdminAuth();
      const { uid } = await auth.verifySessionCookie(sessionCookie, true);
      await auth.revokeRefreshTokens(uid);
    } catch {
      logLogoutFailure("LOGOUT_REVOKE_FAILED");
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  const response = NextResponse.json({ ok: true });
  try {
    clearSessionCookie(response);
  } catch {
    logLogoutFailure("LOGOUT_COOKIE_CLEAR_FAILED");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return response;
}
