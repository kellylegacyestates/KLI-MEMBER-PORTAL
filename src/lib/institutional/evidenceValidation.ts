import type { Evidence } from "@/domain/evidence";
import type {
  EvidenceId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export interface EvidenceScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
  evidenceId: EvidenceId;
}

export function evidenceMatchesScope(
  evidence: Evidence,
  scope: EvidenceScope,
): boolean {
  return (
    evidence.organizationId === scope.organizationId &&
    evidence.workspaceId === scope.workspaceId &&
    evidence.matterId === scope.matterId &&
    evidence.id === scope.evidenceId
  );
}

export function assertEvidenceMatchesScope(
  evidence: Evidence,
  scope: EvidenceScope,
): void {
  if (evidence.organizationId !== scope.organizationId) {
    throw new Error("Evidence organization scope mismatch.");
  }

  if (evidence.workspaceId !== scope.workspaceId) {
    throw new Error("Evidence workspace scope mismatch.");
  }

  if (evidence.matterId !== scope.matterId) {
    throw new Error("Evidence matter scope mismatch.");
  }

  if (evidence.id !== scope.evidenceId) {
    throw new Error("Evidence document ID mismatch.");
  }
}

export function assertEvidenceScopeImmutable(
  current: Evidence,
  next: Evidence,
): void {
  if (next.organizationId !== current.organizationId) {
    throw new Error("Evidence organization scope is immutable.");
  }

  if (next.workspaceId !== current.workspaceId) {
    throw new Error("Evidence workspace scope is immutable.");
  }

  if (next.matterId !== current.matterId) {
    throw new Error("Evidence matter scope is immutable.");
  }

  if (next.id !== current.id) {
    throw new Error("Evidence ID is immutable.");
  }
}
