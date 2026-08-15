import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, getSessionCookieOptions, getSessionDurationMs } from "@/lib/auth/cookies";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { consumeSessionRateLimit } from "@/lib/auth/session-rate-limit";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const RECENT_SIGN_IN_WINDOW_MS = 5 * 60 * 1000;

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

  try {
    const rateLimit = await consumeSessionRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "too_many_requests" },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let idToken = "";

  try {
    const body = (await request.json()) as { idToken?: unknown };
    idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken, true);

    if (decodedToken.email_verified !== true) {
      const response = NextResponse.json(
        { ok: false, error: "email_verification_required" },
        { status: 403 }
      );
      clearSessionCookie(response);
      return response;
    }

    const authTimeMs = decodedToken.auth_time ? decodedToken.auth_time * 1000 : 0;
    if (!authTimeMs || Date.now() - authTimeMs > RECENT_SIGN_IN_WINDOW_MS) {
      const response = NextResponse.json({ ok: false }, { status: 401 });
      clearSessionCookie(response);
      return response;
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: getSessionDurationMs(),
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      getSessionCookieName(),
      sessionCookie,
      getSessionCookieOptions()
    );
    return response;
  } catch {
    const response = NextResponse.json({ ok: false }, { status: 401 });
    clearSessionCookie(response);
    return response;
  }
}
