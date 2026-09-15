import type { Membership } from "@/domain/membership";
import type { OrganizationId, UserId, WorkspaceId } from "@/domain/shared";

import { validateMembershipScope } from "./tenantValidation";

export type TenantAccessDecision =
  | {
      allowed: true;
      reason: "AUTHORIZED";
    }
  | {
      allowed: false;
      reason:
        | "MISSING_MEMBERSHIP"
        | "INACTIVE_MEMBERSHIP"
        | "USER_MISMATCH"
        | "ORGANIZATION_MISMATCH"
        | "WORKSPACE_MISMATCH"
        | "INVALID_MEMBERSHIP";
    };

export function authorizeTenantAccess(params: {
  membership: Membership | null | undefined;
  userId: UserId;
  organizationId: OrganizationId;
  workspaceId?: WorkspaceId;
}): TenantAccessDecision {
  const { membership, userId, organizationId, workspaceId } = params;

  if (!membership) {
    return {
      allowed: false,
      reason: "MISSING_MEMBERSHIP",
    };
  }

  if (membership.userId !== userId) {
    return {
      allowed: false,
      reason: "USER_MISMATCH",
    };
  }

  if (membership.organizationId !== organizationId) {
    return {
      allowed: false,
      reason: "ORGANIZATION_MISMATCH",
    };
  }

  if (
    workspaceId !== undefined &&
    membership.workspaceId !== workspaceId
  ) {
    return {
      allowed: false,
      reason: "WORKSPACE_MISMATCH",
    };
  }

  if (membership.status !== "ACTIVE") {
    return {
      allowed: false,
      reason: "INACTIVE_MEMBERSHIP",
    };
  }

  if (
    !validateMembershipScope({
      membership,
      userId,
      organizationId,
      workspaceId,
    })
  ) {
    return {
      allowed: false,
      reason: "INVALID_MEMBERSHIP",
    };
  }

  return {
    allowed: true,
    reason: "AUTHORIZED",
  };
}
