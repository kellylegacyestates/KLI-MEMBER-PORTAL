import "server-only";

import type { Authority } from "@/domain/authority";
import type {
  AuthorityId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import {
  assertAuthorityMatchesScope,
  assertAuthorityScopeImmutable,
} from "./authorityValidation";
import { authorityDocumentPath } from "./tenantPaths";

function authorityRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  authorityId: AuthorityId,
) {
  return getFirebaseAdminDb().doc(
    authorityDocumentPath(
      organizationId,
      workspaceId,
      matterId,
      authorityId,
    ),
  );
}

export async function getAuthority(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: MatterId,
  authorityId: AuthorityId,
): Promise<Authority | null> {
  const snapshot = await authorityRef(
    organizationId,
    workspaceId,
    matterId,
    authorityId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const authority = snapshot.data() as Authority;

  assertAuthorityMatchesScope(authority, {
    organizationId,
    workspaceId,
    matterId,
    authorityId,
  });

  return authority;
}

export async function createAuthority(
  authority: Authority,
): Promise<void> {
  if (authority.id.trim().length === 0) {
    throw new Error("Authority ID is required.");
  }

  if (authority.organizationId.trim().length === 0) {
    throw new Error("Authority organization ID is required.");
  }

  if (authority.workspaceId.trim().length === 0) {
    throw new Error("Authority workspace ID is required.");
  }

  if (authority.matterId.trim().length === 0) {
    throw new Error("Authority matter ID is required.");
  }

  const ref = authorityRef(
    authority.organizationId,
    authority.workspaceId,
    authority.matterId,
    authority.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(`Authority already exists: ${authority.id}`);
  }

  await ref.create(authority);
}

export async function updateAuthority(
  next: Authority,
): Promise<void> {
  const ref = authorityRef(
    next.organizationId,
    next.workspaceId,
    next.matterId,
    next.id,
  );

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`Authority not found: ${next.id}`);
  }

  const current = snapshot.data() as Authority;

  assertAuthorityMatchesScope(current, {
    organizationId: next.organizationId,
    workspaceId: next.workspaceId,
    matterId: next.matterId,
    authorityId: next.id,
  });

  assertAuthorityScopeImmutable(current, next);

  await ref.set(next, { merge: false });
}
