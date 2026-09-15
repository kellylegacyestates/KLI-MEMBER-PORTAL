import type {
  AuthorityId,
  DeadlineId,
  DeterminationId,
  EvidenceId,
  ISODateTime,
  MatterId,
  ReviewId,
  ReviewStatus,
  TenantScopedRecord,
} from "./shared";

export interface Review extends TenantScopedRecord {
  id: ReviewId;
  matterId: MatterId;
  reviewType: string;
  status: ReviewStatus;
  reviewingBody?: string;
  filedAt?: ISODateTime;
  decidedAt?: ISODateTime;
  deadlineId?: DeadlineId;
  determinationId?: DeterminationId;
  evidenceIds?: EvidenceId[];
  authorityIds?: AuthorityId[];
}
