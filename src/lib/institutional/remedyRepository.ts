import "server-only";

import type { Remedy } from "@/domain/remedy";
import type {
  MatterId,
  OrganizationId,
  RemedyId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertRemedyMatchesScope,
  assertRemedyScopeImmutable,
} from "./remedyValidation";
import { remedyDocumentPath } from "./tenantPaths";

function remedyRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  remedyId: RemedyId,
) {
  return getFirebaseAdminDb().doc(
    remedyDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      remedyId,
    ),
  );
}

export async function getRemedy(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  remedyId: RemedyId,
): Promise<Remedy | null> {
  const snapshot = await remedyRef(
    organizationId,
    workspaceId,
    matterId,
    remedyId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as Remedy;

  assertRemedyMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: remedyId,
  });

  return record;
}

export async function createRemedy(
  record: Remedy,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("Remedy ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("Remedy organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("Remedy workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("Remedy matter ID is required.");
  }

  const ref = remedyRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Remedy already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateRemedy(
  next: Remedy,
): Promise<void> {
  const ref = remedyRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Remedy not found: ${next.id}`);
  }

  const current = snapshot.data() as Remedy;

  assertRemedyMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertRemedyScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
