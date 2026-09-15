import type {
  MatterId,
  PartyId,
  TenantScopedRecord,
} from "./shared";

export type PartyType =
  | "INDIVIDUAL"
  | "AGENCY"
  | "COURT"
  | "COMPANY"
  | "TRUST"
  | "ESTATE"
  | "ORGANIZATION"
  | "GOVERNMENT_BODY"
  | "OTHER";

export interface Party extends TenantScopedRecord {
  id: PartyId;
  matterId: MatterId;
  partyType: PartyType;
  name: string;
  description?: string;
}
