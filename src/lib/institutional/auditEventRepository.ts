import "server-only";

import type { AuditEvent } from "@/domain/auditEvent";
import type {
  AuditEventId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertAuditEventMatchesScope,
  assertWorkspaceScopedAuditEvent,
} from "./auditEventValidation";
import { auditEventDocumentPath } from "./tenantPaths";

function auditEventRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  auditEventId: AuditEventId,
) {
  return getFirebaseAdminDb().doc(
    auditEventDocumentPath(
      organizationId,
      workspaceId,
      auditEventId,
    ),
  );
}

export async function getAuditEvent(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  auditEventId: AuditEventId,
): Promise<AuditEvent | null> {
  const snapshot = await auditEventRef(
    organizationId,
    workspaceId,
    auditEventId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as AuditEvent;

  assertAuditEventMatchesScope(record, {
    organizationId,
    workspaceId,
    auditEventId,
  });

  return record;
}

export async function appendAuditEvent(
  record: AuditEvent,
): Promise<void> {
  assertWorkspaceScopedAuditEvent(record);

  if (record.id.trim().length === 0) {
    throw new Error("AuditEvent ID is required.");
  }

  const ref = auditEventRef(
    record.organizationId,
    record.workspaceId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`AuditEvent already exists: ${record.id}`);
  }

  await ref.create(record);
}
