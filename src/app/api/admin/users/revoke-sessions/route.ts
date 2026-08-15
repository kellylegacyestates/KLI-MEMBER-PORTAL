import { NextResponse, type NextRequest } from "next/server";
import { writeAuditEvent } from "@/lib/auth/audit";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { requireAdmin } from "@/lib/auth/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const MAX_UID_LENGTH = 128;
const MAX_REASON_LENGTH = 500;

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const access = await requireAdmin();
  if (access.kind === "unauthenticated") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (access.kind !== "authorized") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let targetUid = "";
  let reason = "";
  try {
    const body = (await request.json()) as {
      targetUid?: unknown;
      reason?: unknown;
    };
    targetUid = typeof body.targetUid === "string" ? body.targetUid.trim() : "";
    reason = typeof body.reason === "string" ? body.reason.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (
    !targetUid ||
    targetUid.length > MAX_UID_LENGTH ||
    reason.length < 10 ||
    reason.length > MAX_REASON_LENGTH ||
    targetUid === access.user.uid
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await getFirebaseAdminAuth().revokeRefreshTokens(targetUid);
  } catch {
    try {
      await writeAuditEvent({
        action: "admin.sessions.revoke",
        actorUid: access.user.uid,
        targetUid,
        oldValue: null,
        newValue: null,
        reason,
        outcome: "failure",
      });
    } catch {
      // The response remains closed when both the operation and audit sink fail.
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    await writeAuditEvent({
      action: "admin.sessions.revoke",
      actorUid: access.user.uid,
      targetUid,
      oldValue: { sessionsRevoked: false },
      newValue: { sessionsRevoked: true },
      reason,
      outcome: "success",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
