import type { Matter } from "@/domain/matter";
import type {
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export interface MatterScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
}

export function matterMatchesScope(
  matter: Matter,
  scope: MatterScope,
): boolean {
  return (
    matter.id === scope.matterId &&
    matter.organizationId === scope.organizationId &&
    matter.workspaceId === scope.workspaceId
  );
}

export function assertMatterMatchesScope(
  matter: Matter,
  scope: MatterScope,
): void {
  if (matter.id !== scope.matterId) {
    throw new Error("Matter document ID mismatch.");
  }

  if (matter.organizationId !== scope.organizationId) {
    throw new Error("Matter organization scope mismatch.");
  }

  if (matter.workspaceId !== scope.workspaceId) {
    throw new Error("Matter workspace scope mismatch.");
  }
}

export function assertMatterScopeImmutable(
  current: Matter,
  next: Matter,
): void {
  if (next.id !== current.id) {
    throw new Error("Matter ID is immutable.");
  }

  if (next.organizationId !== current.organizationId) {
    throw new Error("Matter organization scope is immutable.");
  }

  if (next.workspaceId !== current.workspaceId) {
    throw new Error("Matter workspace scope is immutable.");
  }
}
