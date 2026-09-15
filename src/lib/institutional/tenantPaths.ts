import type {
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";

export function organizationDocumentPath(
  organizationId: OrganizationId,
): string {
  return `organizations/${organizationId}`;
}

export function workspaceDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}`;
}

export function matterDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}`;
}

export function membershipDocumentPath(
  organizationId: OrganizationId,
  membershipId: string,
): string {
  return `organizations/${organizationId}/memberships/${membershipId}`;
}
