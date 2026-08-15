import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type AuditAction =
  | "admin.sessions.revoke"
  | "user.sessions.revoke"
  | "user.authorization.update";

export type AuditEvent = {
  action: AuditAction;
  actorUid: string;
  targetUid: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  reason: string;
  outcome: "success" | "failure";
};

export async function writeAuditEvent(event: AuditEvent) {
  await getFirebaseAdminDb()
    .collection("auditEvents")
    .add({
      ...event,
      timestamp: FieldValue.serverTimestamp(),
    });
}
