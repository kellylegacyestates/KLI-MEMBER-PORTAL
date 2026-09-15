import "server-only";

import type { Deadline } from "@/domain/deadline";
import type {
  DeadlineId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertDeadlineMatchesScope,
  assertDeadlineScopeImmutable,
} from "./deadlineValidation";
import { deadlineDocumentPath } from "./tenantPaths";

function deadlineRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  deadlineId: DeadlineId,
) {
  return getFirebaseAdminDb().doc(
    deadlineDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      deadlineId,
    ),
  );
}

export async function getDeadline(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  deadlineId: DeadlineId,
): Promise<Deadline | null> {
  const snapshot = await deadlineRef(
    organizationId,
    workspaceId,
    matterId,
    deadlineId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as Deadline;

  assertDeadlineMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: deadlineId,
  });

  return record;
}

export async function createDeadline(
  record: Deadline,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("Deadline ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("Deadline organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("Deadline workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("Deadline matter ID is required.");
  }

  const ref = deadlineRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Deadline already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateDeadline(
  next: Deadline,
): Promise<void> {
  const ref = deadlineRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Deadline not found: ${next.id}`);
  }

  const current = snapshot.data() as Deadline;

  assertDeadlineMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertDeadlineScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
