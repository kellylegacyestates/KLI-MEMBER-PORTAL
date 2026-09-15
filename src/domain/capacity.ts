import type {
  CapacityId,
  MatterId,
  PartyId,
  TenantScopedRecord,
} from "./shared";

export type CapacityType =
  | "TRUSTEE"
  | "BENEFICIARY"
  | "ADMINISTRATOR"
  | "REGULATOR"
  | "CLAIMANT"
  | "RESPONDENT"
  | "COUNSEL"
  | "CUSTODIAN"
  | "REVIEWER"
  | "ISSUING_AUTHORITY"
  | "OTHER";

export interface Capacity extends TenantScopedRecord {
  id: CapacityId;
  matterId: MatterId;
  partyId: PartyId;
  capacityType: CapacityType;
  title?: string;
  description?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}
