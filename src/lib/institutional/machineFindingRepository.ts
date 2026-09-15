import "server-only";

import type { MachineFinding } from "@/domain/machineFinding";
import type {
  MachineFindingId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertMachineFindingMatchesScope,
  assertMachineFindingScopeImmutable,
} from "./machineFindingValidation";
import { machineFindingDocumentPath } from "./tenantPaths";

function machineFindingRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  machineFindingId: MachineFindingId,
) {
  return getFirebaseAdminDb().doc(
    machineFindingDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      machineFindingId,
    ),
  );
}

export async function getMachineFinding(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  machineFindingId: MachineFindingId,
): Promise<MachineFinding | null> {
  const snapshot = await machineFindingRef(
    organizationId,
    workspaceId,
    matterId,
    machineFindingId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const record = snapshot.data() as MachineFinding;

  assertMachineFindingMatchesScope(record, {
    organizationId,
    workspaceId,
    matterId,
    recordId: machineFindingId,
  });

  return record;
}

export async function createMachineFinding(
  record: MachineFinding,
): Promise<void> {
  if (record.id.trim().length === 0) {
    throw new Error("MachineFinding ID is required.");
  }

  if (record.organizationId.trim().length === 0) {
    throw new Error("MachineFinding organization ID is required.");
  }

  if (record.workspaceId.trim().length === 0) {
    throw new Error("MachineFinding workspace ID is required.");
  }

  if (record.matterId.trim().length === 0) {
    throw new Error("MachineFinding matter ID is required.");
  }

  const ref = machineFindingRef(
    record.organizationId,
    record.workspaceId,
    record.matterId,
    record.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`MachineFinding already exists: ${record.id}`);
  }

  await ref.create(record);
}

export async function updateMachineFinding(
  next: MachineFinding,
): Promise<void> {
  const ref = machineFindingRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`MachineFinding not found: ${next.id}`);
  }

  const current = snapshot.data() as MachineFinding;

  assertMachineFindingMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    recordId: next.id,
  });

  assertMachineFindingScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
