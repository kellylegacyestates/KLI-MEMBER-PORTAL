import type {
  AuthorityId,
  CapacityId,
  DeterminationId,
  EvidenceId,
  ISODateTime,
  MatterId,
  PartyId,
  TenantScopedRecord,
} from "./shared";

export type DeterminationDisposition =
  | "GRANTED"
  | "DENIED"
  | "DISMISSED"
  | "SUSTAINED"
  | "REMANDED"
  | "PARTIALLY_GRANTED"
  | "OTHER";

export interface Determination extends TenantScopedRecord {
  id: DeterminationId;
  matterId: MatterId;
  determinationType: string;
  issuingPartyId?: PartyId;
  issuingCapacityId?: CapacityId;
  issueDate: ISODateTime;
  effectiveDate?: ISODateTime;
  findings?: string[];
  authorityIds?: AuthorityId[];
  evidenceIds?: EvidenceId[];
  disposition?: DeterminationDisposition;
  reviewAvailable?: boolean;
  sourceEvidenceId?: EvidenceId;
}
