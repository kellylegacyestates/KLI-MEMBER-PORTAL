import type {
  AuthorityId,
  EvidenceId,
  ISODateTime,
  MatterId,
  TenantScopedRecord,
} from "./shared";

export type AuthorityType =
  | "STATUTE"
  | "REGULATION"
  | "CASE"
  | "EXECUTIVE_ORDER"
  | "AGENCY_ORDER"
  | "RULE"
  | "POLICY"
  | "CONTRACT"
  | "TRUST_INSTRUMENT"
  | "OTHER";

export type AuthorityVerificationStatus =
  | "UNVERIFIED"
  | "CANDIDATE"
  | "VERIFIED"
  | "QUALIFIED"
  | "DISPUTED"
  | "SUPERSEDED";

export interface Authority extends TenantScopedRecord {
  id: AuthorityId;
  matterId: MatterId;
  authorityType: AuthorityType;
  citation?: string;
  title: string;
  jurisdiction?: string;
  issuingBody?: string;
  effectiveDate?: ISODateTime;
  verificationStatus: AuthorityVerificationStatus;
  delegation?: string;
  duty?: string;
  procedure?: string;
  reviewRights?: string;
  remedy?: string;
  sourceEvidenceIds?: EvidenceId[];
}
