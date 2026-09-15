import type {
  AuthorityId,
  DeterminationId,
  EvidenceId,
  ISODateTime,
  MatterId,
  RemedyId,
  TenantScopedRecord,
} from "./shared";

export type RemedyStatus =
  | "AVAILABLE"
  | "PRESERVED"
  | "INVOKED"
  | "RESOLVED"
  | "EXHAUSTED"
  | "UNAVAILABLE";

export interface Remedy extends TenantScopedRecord {
  id: RemedyId;
  matterId: MatterId;
  remedyType: string;
  authorityIds?: AuthorityId[];
  prerequisites?: string[];
  status: RemedyStatus;
  preservationDate?: ISODateTime;
  invocationDate?: ISODateTime;
  exhaustionDate?: ISODateTime;
  resultingDeterminationId?: DeterminationId;
  evidenceIds?: EvidenceId[];
  notes?: string;
}
