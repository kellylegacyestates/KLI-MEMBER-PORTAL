import type {
  EvidenceId,
  ISODateTime,
  MachineFindingDisposition,
  MachineFindingId,
  MatterId,
  TenantScopedRecord,
  UserId,
} from "./shared";

export interface MachineFinding extends TenantScopedRecord {
  id: MachineFindingId;
  matterId: MatterId;
  sourceRunId: string;
  sourceEvidenceIds?: EvidenceId[];
  findingType: string;
  findingText: string;
  confidence?: number;
  generatedAt: ISODateTime;
  processorVersion?: string;
  disposition: MachineFindingDisposition;
  reviewedBy?: UserId;
  reviewedAt?: ISODateTime;
}
