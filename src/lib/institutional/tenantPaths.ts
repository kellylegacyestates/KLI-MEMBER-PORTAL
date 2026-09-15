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


export function communicationDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  communicationId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/communications/${communicationId}`;
}

export function deadlineDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  deadlineId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/deadlines/${deadlineId}`;
}

export function determinationDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  determinationId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/determinations/${determinationId}`;
}

export function reviewDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  reviewId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/reviews/${reviewId}`;
}

export function remedyDocumentPath(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
  matterId: string,
  remedyId: string,
): string {
  return `organizations/${organizationId}/workspaces/${workspaceId}/matters/${matterId}/remedies/${remedyId}`;
}

export function membershipDocumentPath(
  organizationId: OrganizationId,
  membershipId: string,
): string {
  return `organizations/${organizationId}/memberships/${membershipId}`;
}
