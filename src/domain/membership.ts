import type {
  ISODateTime,
  OrganizationId,
  UserId,
  WorkspaceId,
} from "./shared";

export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "REVOKED"
  | "ARCHIVED";

export interface Membership {
  id: string;
  userId: UserId;
  organizationId: OrganizationId;
  workspaceId?: WorkspaceId;
  status: MembershipStatus;
  roleIds: string[];
  joinedAt?: ISODateTime;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
