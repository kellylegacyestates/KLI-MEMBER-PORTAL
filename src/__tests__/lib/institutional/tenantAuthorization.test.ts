import { describe, expect, it } from "vitest";

import type { Membership } from "@/domain/membership";
import { authorizeTenantAccess } from "@/lib/institutional/tenantAuthorization";

function activeMembership(
  overrides: Partial<Membership> = {},
): Membership {
  return {
    id: "membership-001",
    userId: "user-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    status: "ACTIVE",
    roleIds: ["member"],
    createdAt: "2026-09-15T21:00:00Z",
    updatedAt: "2026-09-15T21:00:00Z",
    ...overrides,
  };
}

describe("tenant authorization", () => {
  it("authorizes an active membership within matching tenant scope", () => {
    const result = authorizeTenantAccess({
      membership: activeMembership(),
      userId: "user-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
    });

    expect(result).toEqual({
      allowed: true,
      reason: "AUTHORIZED",
    });
  });

  it("rejects cross-organization access", () => {
    const result = authorizeTenantAccess({
      membership: activeMembership(),
      userId: "user-001",
      organizationId: "org-999",
      workspaceId: "workspace-001",
    });

    expect(result).toEqual({
      allowed: false,
      reason: "ORGANIZATION_MISMATCH",
    });
  });

  it("rejects cross-workspace access", () => {
    const result = authorizeTenantAccess({
      membership: activeMembership(),
      userId: "user-001",
      organizationId: "org-001",
      workspaceId: "workspace-999",
    });

    expect(result).toEqual({
      allowed: false,
      reason: "WORKSPACE_MISMATCH",
    });
  });

  it("rejects inactive memberships", () => {
    const result = authorizeTenantAccess({
      membership: activeMembership({
        status: "SUSPENDED",
      }),
      userId: "user-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
    });

    expect(result).toEqual({
      allowed: false,
      reason: "INACTIVE_MEMBERSHIP",
    });
  });
});
