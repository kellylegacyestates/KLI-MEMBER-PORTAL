import type {
  ISODateTime,
  MatterId,
  MatterStatus,
  TenantScopedRecord,
  UserId,
} from "./shared";

export type MatterType =
  | "ADMINISTRATIVE"
  | "RULEMAKING"
  | "PUBLIC_RECORDS"
  | "LITIGATION"
  | "REGULATORY"
  | "TRUST_GOVERNANCE"
  | "ESTATE_GOVERNANCE"
  | "FINANCIAL_ADMINISTRATION"
  | "RESEARCH"
  | "INTERNAL_GOVERNANCE"
  | "OTHER";

export interface Matter extends TenantScopedRecord {
  id: MatterId;
  matterNumber: string;
  title: string;
  description?: string;
  matterType: MatterType;
  jurisdiction?: string;
  status: MatterStatus;
  openedAt?: ISODateTime;
  closedAt?: ISODateTime;
  assignedUserIds?: UserId[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
