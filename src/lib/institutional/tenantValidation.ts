import type { Membership, MembershipStatus } from "@/domain/membership";
import type { OrganizationId, UserId, WorkspaceId } from "@/domain/shared";

const VALID_MEMBERSHIP_STATUSES: ReadonlySet<MembershipStatus> = new Set([
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "REVOKED",
  "ARCHIVED",
]);

export function isValidMembershipStatus(
  value: unknown,
): value is MembershipStatus {
  return (
    typeof value === "string" &&
    VALID_MEMBERSHIP_STATUSES.has(value as MembershipStatus)
  );
}

export function isActiveMembership(
  membership: Membership | null | undefined,
): membership is Membership & { status: "ACTIVE" } {
  return membership?.status === "ACTIVE";
}

export function membershipMatchesUser(
  membership: Membership,
  userId: UserId,
): boolean {
  return membership.userId === userId;
}

export function membershipMatchesOrganization(
  membership: Membership,
  organizationId: OrganizationId,
): boolean {
  return membership.organizationId === organizationId;
}

export function membershipMatchesWorkspace(
  membership: Membership,
  workspaceId: WorkspaceId,
): boolean {
  return membership.workspaceId === workspaceId;
}

export function validateMembershipScope(params: {
  membership: Membership | null | undefined;
  userId: UserId;
  organizationId: OrganizationId;
  workspaceId?: WorkspaceId;
}): boolean {
  const { membership, userId, organizationId, workspaceId } = params;

  if (!membership) {
    return false;
  }

  if (!isValidMembershipStatus(membership.status)) {
    return false;
  }

  if (!isActiveMembership(membership)) {
    return false;
  }

  if (!membershipMatchesUser(membership, userId)) {
    return false;
  }

  if (!membershipMatchesOrganization(membership, organizationId)) {
    return false;
  }

  if (workspaceId !== undefined) {
    if (membership.workspaceId === undefined) {
      return false;
    }

    if (!membershipMatchesWorkspace(membership, workspaceId)) {
      return false;
    }
  }

  return true;
}
