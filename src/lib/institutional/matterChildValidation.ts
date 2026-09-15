import type {
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export interface MatterChildRecord {
  id: string;
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
}

export interface MatterChildScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
  recordId: string;
}

export function assertMatterChildMatchesScope(
  record: MatterChildRecord,
  scope: MatterChildScope,
  label: string,
): void {
  if (record.organizationId !== scope.organizationId) {
    throw new Error(`${label} organization scope mismatch.`);
  }

  if (record.workspaceId !== scope.workspaceId) {
    throw new Error(`${label} workspace scope mismatch.`);
  }

  if (record.matterId !== scope.matterId) {
    throw new Error(`${label} matter scope mismatch.`);
  }

  if (record.id !== scope.recordId) {
    throw new Error(`${label} document ID mismatch.`);
  }
}

export function assertMatterChildScopeImmutable(
  current: MatterChildRecord,
  next: MatterChildRecord,
  label: string,
): void {
  if (next.organizationId !== current.organizationId) {
    throw new Error(`${label} organization scope is immutable.`);
  }

  if (next.workspaceId !== current.workspaceId) {
    throw new Error(`${label} workspace scope is immutable.`);
  }

  if (next.matterId !== current.matterId) {
    throw new Error(`${label} matter scope is immutable.`);
  }

  if (next.id !== current.id) {
    throw new Error(`${label} ID is immutable.`);
  }
}
