import { describe, expect, it } from "vitest";

import type { Membership } from "@/domain/membership";
import {
  isActiveMembership,
  validateMembershipScope,
} from "@/lib/institutional/tenantValidation";

const membership: Membership = {
  id: "membership-001",
  userId: "user-001",
  organizationId: "org-001",
  workspaceId: "workspace-001",
  status: "ACTIVE",
  roleIds: ["member"],
  createdAt: "2026-09-15T21:00:00Z",
  updatedAt: "2026-09-15T21:00:00Z",
};

describe("tenant validation", () => {
  it("fails closed when membership is missing", () => {
    expect(
      validateMembershipScope({
        membership: undefined,
        userId: "user-001",
        organizationId: "org-001",
        workspaceId: "workspace-001",
      }),
    ).toBe(false);
  });

  it("requires active status", () => {
    expect(
      isActiveMembership({
        ...membership,
        status: "REVOKED",
      }),
    ).toBe(false);
  });

  it("accepts matching active tenant scope", () => {
    expect(
      validateMembershipScope({
        membership,
        userId: "user-001",
        organizationId: "org-001",
        workspaceId: "workspace-001",
      }),
    ).toBe(true);
  });
});
