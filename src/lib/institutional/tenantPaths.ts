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


export function evidenceDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  evidenceId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/evidence/${evidenceId}`;
}

export function authorityDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  authorityId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/authorities/${authorityId}`;
}

export function membershipDocumentPath(
  organizationId: OrganizationId,
  membershipId: string,
): string {
  return `organizations/${organizationId}/memberships/${membershipId}`;
}
