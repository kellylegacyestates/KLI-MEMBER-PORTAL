import type { AuditEvent } from "@/domain/auditEvent";
import type {
  AuditEventId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export interface AuditEventScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  auditEventId: AuditEventId;
}

export function assertAuditEventMatchesScope(
  record: AuditEvent,
  scope: AuditEventScope,
): void {
  if (record.organizationId !== scope.organizationId) {
    throw new Error("AuditEvent organization scope mismatch.");
  }

  if (record.workspaceId !== scope.workspaceId) {
    throw new Error("AuditEvent workspace scope mismatch.");
  }

  if (record.id !== scope.auditEventId) {
    throw new Error("AuditEvent document ID mismatch.");
  }
}

export function assertWorkspaceScopedAuditEvent(
  record: AuditEvent,
): asserts record is AuditEvent & {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
} {
  if (!record.organizationId) {
    throw new Error("AuditEvent organization ID is required.");
  }

  if (!record.workspaceId) {
    throw new Error("AuditEvent workspace ID is required.");
  }
}
