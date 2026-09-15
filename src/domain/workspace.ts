import type {
  InstitutionalRecord,
  OrganizationId,
  UserId,
  WorkspaceId,
} from "./shared";

export type WorkspaceStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

export type WorkspaceType =
  | "INTERNAL"
  | "CLIENT"
  | "RESEARCH"
  | "MATTER"
  | "EDUCATION"
  | "OTHER";

export interface Workspace extends InstitutionalRecord {
  id: WorkspaceId;
  organizationId: OrganizationId;
  name: string;
  slug: string;
  type: WorkspaceType;
  status: WorkspaceStatus;
  ownerUserId?: UserId;
  createdAt: string;
  updatedAt: string;
}
