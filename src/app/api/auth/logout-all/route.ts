import { NextResponse, type NextRequest } from "next/server";
import { writeAuditEvent } from "@/lib/auth/audit";
import { getSessionCookieName, getSessionCookieOptions } from "@/lib/auth/cookies";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieOptions(0),
    expires: new Date(0),
  });
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const sessionCookie = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionCookie) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const auth = getFirebaseAdminAuth();
  let uid = "";
  try {
    uid = (await auth.verifySessionCookie(sessionCookie, true)).uid;
  } catch {
    const response = NextResponse.json({ ok: false }, { status: 401 });
    clearSessionCookie(response);
    return response;
  }

  try {
    await auth.revokeRefreshTokens(uid);
  } catch {
    try {
      await writeAuditEvent({
        action: "user.sessions.revoke",
        actorUid: uid,
        targetUid: uid,
        oldValue: null,
        newValue: null,
        reason: "User requested sign out on all devices.",
        outcome: "failure",
      });
    } catch {
      // The response remains closed when both the operation and audit sink fail.
    }
    const response = NextResponse.json({ ok: false }, { status: 500 });
    clearSessionCookie(response);
    return response;
  }

  try {
    await writeAuditEvent({
      action: "user.sessions.revoke",
      actorUid: uid,
      targetUid: uid,
      oldValue: { sessionsRevoked: false },
      newValue: { sessionsRevoked: true },
      reason: "User requested sign out on all devices.",
      outcome: "success",
    });
  } catch {
    // Revocation already succeeded; do not report the security action as failed.
    console.error("Session revocation succeeded, but its audit event could not be recorded.");
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
