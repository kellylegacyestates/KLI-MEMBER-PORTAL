import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { writeAuditEvent } from "@/lib/auth/audit";
import { isTrustedOrigin } from "@/lib/auth/request-safety";
import { requireAdmin } from "@/lib/auth/server";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";
import type {
  AccountStatus,
  MembershipStatus,
  UserRole,
} from "@/lib/firebase/userProfile";
import {
  isValidAccountStatus,
  isValidMembershipStatus,
  isValidRole,
} from "@/lib/firebase/userProfileValidators";

export const runtime = "nodejs";

const MAX_UID_LENGTH = 128;
const MAX_REASON_LENGTH = 500;

type AuthorizationState = {
  role: UserRole;
  accountStatus: AccountStatus;
  membershipStatus: MembershipStatus;
};

type AuthorizationUpdate = Partial<AuthorizationState>;

function isAccessReduction(oldValue: AuthorizationState, newValue: AuthorizationState) {
  const rolePriority: Record<UserRole, number> = {
    member: 0,
    instructor: 1,
    executive: 2,
    admin: 3,
  };

  return (
    (oldValue.accountStatus === "active" && newValue.accountStatus !== "active") ||
    (oldValue.membershipStatus === "active" && newValue.membershipStatus !== "active") ||
    ((oldValue.role === "admin" || oldValue.role === "executive") &&
      rolePriority[newValue.role] < rolePriority[oldValue.role])
  );
}

function error(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return error("Request origin is not allowed.", 403);
  }

  const access = await requireAdmin();
  if (access.kind === "unauthenticated") {
    return error("Authentication is required.", 401);
  }
  if (access.kind !== "authorized") {
    return error("Administrator access is required.", 403);
  }

  let uid = "";
  let reason = "";
  const updates: AuthorizationUpdate = {};

  try {
    const body = (await request.json()) as Record<string, unknown>;
    uid = typeof body.uid === "string" ? body.uid.trim() : "";
    reason = typeof body.reason === "string" ? body.reason.trim() : "";

    if (Object.hasOwn(body, "role")) {
      if (!isValidRole(body.role)) {
        return error("Invalid role.", 400);
      }
      updates.role = body.role;
    }
    if (Object.hasOwn(body, "accountStatus")) {
      if (!isValidAccountStatus(body.accountStatus)) {
        return error("Invalid account status.", 400);
      }
      updates.accountStatus = body.accountStatus;
    }
    if (Object.hasOwn(body, "membershipStatus")) {
      if (!isValidMembershipStatus(body.membershipStatus)) {
        return error("Invalid membership status.", 400);
      }
      updates.membershipStatus = body.membershipStatus;
    }
  } catch {
    return error("Invalid JSON payload.", 400);
  }

  if (!uid || uid.length > MAX_UID_LENGTH) {
    return error("A valid target user ID is required.", 400);
  }
  if (!reason || reason.length > MAX_REASON_LENGTH) {
    return error("A non-empty reason is required.", 400);
  }
  if (Object.keys(updates).length === 0) {
    return error("At least one authorization field is required.", 400);
  }

  if (
    uid === access.user.uid &&
    ((updates.role !== undefined && updates.role !== "admin") ||
      (updates.accountStatus !== undefined && updates.accountStatus !== "active") ||
      (updates.membershipStatus !== undefined && updates.membershipStatus !== "active"))
  ) {
    return error("Administrators cannot remove their own access.", 409);
  }

  const db = getFirebaseAdminDb();
  const userRef = db.collection("users").doc(uid);
  const auditRef = db.collection("auditEvents").doc();

  let result:
    | { kind: "missing" }
    | { kind: "invalid-profile" }
    | { kind: "unchanged" }
    | {
        kind: "changed";
        oldValue: AuthorizationState;
        newValue: AuthorizationState;
        shouldRevokeSessions: boolean;
      };

  try {
    result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(userRef);
      if (!snapshot.exists) {
        return { kind: "missing" as const };
      }

      const profile = snapshot.data();
      if (
        !isValidRole(profile?.role) ||
        !isValidAccountStatus(profile?.accountStatus) ||
        !isValidMembershipStatus(profile?.membershipStatus)
      ) {
        return { kind: "invalid-profile" as const };
      }

      const oldValue: AuthorizationState = {
        role: profile.role,
        accountStatus: profile.accountStatus,
        membershipStatus: profile.membershipStatus,
      };
      const newValue: AuthorizationState = { ...oldValue, ...updates };

      if (
        oldValue.role === newValue.role &&
        oldValue.accountStatus === newValue.accountStatus &&
        oldValue.membershipStatus === newValue.membershipStatus
      ) {
        return { kind: "unchanged" as const };
      }

      const timestamp = FieldValue.serverTimestamp();
      transaction.update(userRef, {
        ...updates,
        updatedAt: timestamp,
      });
      transaction.create(auditRef, {
        action: "user.authorization.update",
        actorUid: access.user.uid,
        targetUid: uid,
        oldValue,
        newValue,
        timestamp,
        reason,
        outcome: "success",
      });

      return {
        kind: "changed" as const,
        oldValue,
        newValue,
        shouldRevokeSessions: isAccessReduction(oldValue, newValue),
      };
    });
  } catch {
    return error("Authorization could not be updated.", 500);
  }

  if (result.kind === "missing") {
    return error("Target user profile was not found.", 404);
  }
  if (result.kind === "invalid-profile") {
    return error("Target user authorization is invalid.", 409);
  }
  if (result.kind === "unchanged") {
    return NextResponse.json({
      ok: true,
      changed: false,
      sessionsRevoked: false,
    });
  }
  if (!result.shouldRevokeSessions) {
    return NextResponse.json({
      ok: true,
      changed: true,
      sessionsRevoked: false,
    });
  }

  try {
    await getFirebaseAdminAuth().revokeRefreshTokens(uid);
    return NextResponse.json({
      ok: true,
      changed: true,
      sessionsRevoked: true,
    });
  } catch {
    console.error("Authorization changed, but target session revocation failed.");
    try {
      await writeAuditEvent({
        action: "admin.sessions.revoke",
        actorUid: access.user.uid,
        targetUid: uid,
        oldValue: { sessionsRevoked: false },
        newValue: { sessionsRevoked: true },
        reason: `Automatic revocation after authorization update: ${reason}`,
        outcome: "failure",
      });
    } catch {
      console.error("The session revocation failure audit event could not be recorded.");
    }

    return NextResponse.json(
      {
        ok: true,
        changed: true,
        sessionsRevoked: false,
        error: "Authorization updated, but session revocation failed.",
      },
      { status: 207 }
    );
  }
}
