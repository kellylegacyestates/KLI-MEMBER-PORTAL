import "server-only";

import type { Matter } from "@/domain/matter";
import type {
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertMatterMatchesScope,
  assertMatterScopeImmutable,
} from "./matterValidation";
import { matterDocumentPath } from "./tenantPaths";

function matterRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
) {
  return getFirebaseAdminDb().doc(
    matterDocumentPath(
      organizationId,
      workspaceId,
      matterId,
    ),
  );
}

export async function getMatter(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
): Promise<Matter | null> {
  const snapshot = await matterRef(
    organizationId,
    workspaceId,
    matterId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const matter = snapshot.data() as Matter;

  assertMatterMatchesScope(matter, {
    organizationId,
    workspaceId,
    matterId,
  });

  return matter;
}

export async function createMatter(
  matter: Matter,
): Promise<void> {
  assertMatterMatchesScope(matter, {
    organizationId: matter.organizationId,
    workspaceId: matter.workspaceId,
    matterId: matter.id,
  });

  if (matter.id.trim().length === 0) {
    throw new Error("Matter ID is required.");
  }

  if (matter.organizationId.trim().length === 0) {
    throw new Error("Matter organization ID is required.");
  }

  if (matter.workspaceId.trim().length === 0) {
    throw new Error("Matter workspace ID is required.");
  }

  const ref = matterRef(
    matter.organizationId,
    matter.workspaceId,
    matter.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Matter already exists: ${matter.id}`);
  }

  await ref.create(matter);
}

export async function updateMatter(
  next: Matter,
): Promise<void> {
  const ref = matterRef(
    next.organizationId,
    next.workspaceId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Matter not found: ${next.id}`);
  }

  const current = snapshot.data() as Matter;

  assertMatterMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.id,
  });

  assertMatterScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
