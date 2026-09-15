import "server-only";

import type { Communication } from "@/domain/communication";
import type {
  CommunicationId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertCommunicationMatchesScope,
  assertCommunicationScopeImmutable,
} from "./communicationValidation";
import { communicationDocumentPath } from "./tenantPaths";

function communicationRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  communicationId: CommunicationId,
) {
  return getFirebaseAdminDb().doc(
    communicationDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      communicationId,
    ),
  );
}

export async function getCommunication(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  communicationId: CommunicationId,
): Promise<Communication | null> {
  const snapshot = await communicationRef(
    organizationId,
    workspaceId,
    matterId,
    communicationId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as Communication;

  assertCommunicationMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: communicationId,
  });

  return record;
}

export async function createCommunication(
  record: Communication,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("Communication ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("Communication organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("Communication workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("Communication matter ID is required.");
  }

  const ref = communicationRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Communication already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateCommunication(
  next: Communication,
): Promise<void> {
  const ref = communicationRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Communication not found: ${next.id}`);
  }

  const current = snapshot.data() as Communication;

  assertCommunicationMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertCommunicationScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
