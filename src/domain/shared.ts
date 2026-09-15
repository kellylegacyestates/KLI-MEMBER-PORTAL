/**
 * Kelly Legacy Institute Institutional Platform
 * P4-W02 — Institutional Domain Model
 *
 * Shared domain primitives.
 *
 * This module is intentionally infrastructure-independent.
 * It must not import Firebase, Firestore, React, Next.js,
 * or any persistence-specific dependency.
 */

export type ISODateTime = string;

export type EntityId = string;
export type OrganizationId = EntityId;
export type WorkspaceId = EntityId;
export type MatterId = EntityId;
export type PartyId = EntityId;
export type CapacityId = EntityId;
export type AuthorityId = EntityId;
export type EvidenceId = EntityId;
export type CommunicationId = EntityId;
export type DeadlineId = EntityId;
export type DeterminationId = EntityId;
export type ReviewId = EntityId;
export type RemedyId = EntityId;
export type MachineFindingId = EntityId;
export type AuditEventId = EntityId;
export type UserId = EntityId;

export type RecordIntegrityStatus =
  | "UNREVIEWED"
  | "VERIFIED"
  | "QUALIFIED"
  | "DISPUTED"
  | "DEFECTIVE";

export type ProvenanceMethod =
  | "HUMAN"
  | "IMPORT"
  | "SYSTEM"
  | "LDIE_PROPOSAL";

export interface RecordProvenance {
  sourceType: string;
  sourceIdentifier?: string;
  createdBy: UserId;
  createdAt: ISODateTime;
  creationMethod: ProvenanceMethod;
  sourceEvidenceIds?: EvidenceId[];
  machineRunId?: string;
}

export interface TenantScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
}

export interface InstitutionalRecord {
  id: EntityId;
  integrityStatus: RecordIntegrityStatus;
  provenance: RecordProvenance;
}

export interface TenantScopedRecord extends InstitutionalRecord, TenantScope {}

export type MatterStatus =
  | "DRAFT"
  | "OPEN"
  | "AWAITING_ACTION"
  | "AWAITING_RESPONSE"
  | "UNDER_REVIEW"
  | "DETERMINED"
  | "ON_REVIEW"
  | "CLOSED"
  | "ARCHIVED";

export type EvidenceStatus =
  | "IDENTIFIED"
  | "REQUESTED"
  | "RECEIVED"
  | "AUTHENTICATED"
  | "ADMITTED"
  | "REJECTED"
  | "SUPERSEDED"
  | "PRESERVED";

export type ReviewStatus =
  | "NOT_AVAILABLE"
  | "AVAILABLE"
  | "PENDING"
  | "FILED"
  | "DECIDED"
  | "EXHAUSTED";

export type MachineFindingDisposition =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "ADOPTED"
  | "REJECTED"
  | "SUPERSEDED";

export type RecordCreationActor =
  | {
      kind: "USER";
      userId: UserId;
    }
  | {
      kind: "SYSTEM";
      systemId: string;
    }
  | {
      kind: "LDIE";
      runId: string;
    };
