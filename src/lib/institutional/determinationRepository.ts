import "server-only";

import type { Determination } from "@/domain/determination";
import type {
  DeterminationId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertDeterminationMatchesScope,
  assertDeterminationScopeImmutable,
} from "./determinationValidation";
import { determinationDocumentPath } from "./tenantPaths";

function determinationRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  determinationId: DeterminationId,
) {
  return getFirebaseAdminDb().doc(
    determinationDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      determinationId,
    ),
  );
}

export async function getDetermination(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  determinationId: DeterminationId,
): Promise<Determination | null> {
  const snapshot = await determinationRef(
    organizationId,
    workspaceId,
    matterId,
    determinationId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as Determination;

  assertDeterminationMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: determinationId,
  });

  return record;
}

export async function createDetermination(
  record: Determination,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("Determination ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("Determination organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("Determination workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("Determination matter ID is required.");
  }

  const ref = determinationRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Determination already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateDetermination(
  next: Determination,
): Promise<void> {
  const ref = determinationRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Determination not found: ${next.id}`);
  }

  const current = snapshot.data() as Determination;

  assertDeterminationMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertDeterminationScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
