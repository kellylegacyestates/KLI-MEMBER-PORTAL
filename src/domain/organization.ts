import type {
  InstitutionalRecord,
  OrganizationId,
  UserId,
} from "./shared";

export type OrganizationStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

export type OrganizationType =
  | "KLI_INTERNAL"
  | "PROFESSIONAL"
  | "FIDUCIARY"
  | "RESEARCH"
  | "LEGAL"
  | "COMPLIANCE"
  | "ENTERPRISE"
  | "OTHER";

export interface Organization extends InstitutionalRecord {
  id: OrganizationId;
  name: string;
  slug: string;
  type: OrganizationType;
  status: OrganizationStatus;
  ownerUserId?: UserId;
  createdAt: string;
  updatedAt: string;
}
