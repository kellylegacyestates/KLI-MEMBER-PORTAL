import type {
  AuthorityId,
  DeadlineId,
  EvidenceId,
  ISODateTime,
  MatterId,
  TenantScopedRecord,
} from "./shared";

export type DeadlineStatus =
  | "PENDING"
  | "SATISFIED"
  | "MISSED"
  | "CANCELLED"
  | "SUPERSEDED";

export interface Deadline extends TenantScopedRecord {
  id: DeadlineId;
  matterId: MatterId;
  deadlineType: string;
  dueAt: ISODateTime;
  authorityId?: AuthorityId;
  triggeringEvidenceId?: EvidenceId;
  calculationMethod?: string;
  status: DeadlineStatus;
  satisfiedAt?: ISODateTime;
  satisfyingEvidenceId?: EvidenceId;
  notes?: string;
}
