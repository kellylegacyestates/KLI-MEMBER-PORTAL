import type {
  ISODateTime,
  OrganizationId,
  UserId,
  WorkspaceId,
} from "./shared";

export type EntitlementStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED";

export interface Entitlement {
  id: string;
  organizationId: OrganizationId;
  workspaceId?: WorkspaceId;
  userId?: UserId;
  capability: string;
  status: EntitlementStatus;
  effectiveAt: ISODateTime;
  expiresAt?: ISODateTime;
}
