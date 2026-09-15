import type {
  AuditEventId,
  ISODateTime,
  OrganizationId,
  UserId,
  WorkspaceId,
} from "./shared";

export type AuditActorType =
  | "USER"
  | "SYSTEM"
  | "LDIE";

export interface AuditEvent {
  id: AuditEventId;
  organizationId?: OrganizationId;
  workspaceId?: WorkspaceId;
  actorType: AuditActorType;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  occurredAt: ISODateTime;
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
  createdBy?: UserId;
}
