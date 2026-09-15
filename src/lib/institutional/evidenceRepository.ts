import "server-only";

import type { Evidence } from "@/domain/evidence";
import type {
  EvidenceId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertEvidenceMatchesScope,
  assertEvidenceScopeImmutable,
} from "./evidenceValidation";
import { evidenceDocumentPath } from "./tenantPaths";

function evidenceRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  evidenceId: EvidenceId,
) {
  return getFirebaseAdminDb().doc(
    evidenceDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      evidenceId,
    ),
  );
}

export async function getEvidence(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  evidenceId: EvidenceId,
): Promise<Evidence | null> {
  const snapshot = await evidenceRef(
    organizationId,
    workspaceId,
    matterId,
    evidenceId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const evidence = snapshot.data() as Evidence;

  assertEvidenceMatchesScope(evidence, {
    organizationId,
    workspaceId,
    matterId,
    evidenceId,
  });

  return evidence;
}

export async function createEvidence(
  evidence: Evidence,
): Promise<void> {
  if (evidence.id.trim().length === 0) {
    throw new Error("Evidence ID is required.");
  }

  if (evidence.organizationId.trim().length === 0) {
    throw new Error("Evidence organization ID is required.");
  }

  if (evidence.workspaceId.trim().length === 0) {
    throw new Error("Evidence workspace ID is required.");
  }

  if (evidence.matterId.trim().length === 0) {
    throw new Error("Evidence matter ID is required.");
  }

  const ref = evidenceRef(
    evidence.organizationId,
    evidence.workspaceId,
    evidence.matterId,
    evidence.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Evidence already exists: ${evidence.id}`);
  }

  await ref.create(evidence);
}

export async function updateEvidence(
  next: Evidence,
): Promise<void> {
  const ref = evidenceRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Evidence not found: ${next.id}`);
  }

  const current = snapshot.data() as Evidence;

  assertEvidenceMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    evidenceId: next.id,
  });

  assertEvidenceScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
