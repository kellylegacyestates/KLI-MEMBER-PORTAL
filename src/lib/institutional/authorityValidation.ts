import type { Authority } from "@/domain/authority";
import type {
  AuthorityId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export interface AuthorityScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
  authorityId: AuthorityId;
}

export function authorityMatchesScope(
  authority: Authority,
  scope: AuthorityScope,
): boolean {
  return (
    authority.organizationId === scope.organizationId &&
    authority.workspaceId === scope.workspaceId &&
    authority.matterId === scope.matterId &&
    authority.id === scope.authorityId
  );
}

export function assertAuthorityMatchesScope(
  authority: Authority,
  scope: AuthorityScope,
): void {
  if (authority.organizationId !== scope.organizationId) {
    throw new Error("Authority organization scope mismatch.");
  }

  if (authority.workspaceId !== scope.workspaceId) {
    throw new Error("Authority workspace scope mismatch.");
  }

  if (authority.matterId !== scope.matterId) {
    throw new Error("Authority matter scope mismatch.");
  }

  if (authority.id !== scope.authorityId) {
    throw new Error("Authority document ID mismatch.");
  }
}

export function assertAuthorityScopeImmutable(
  current: Authority,
  next: Authority,
): void {
  if (next.organizationId !== current.organizationId) {
    throw new Error("Authority organization scope is immutable.");
  }

  if (next.workspaceId !== current.workspaceId) {
    throw new Error("Authority workspace scope is immutable.");
  }

  if (next.matterId !== current.matterId) {
    throw new Error("Authority matter scope is immutable.");
  }

  if (next.id !== current.id) {
    throw new Error("Authority ID is immutable.");
  }
}
