import { describe, expect, it } from "vitest";

import type { Organization } from "@/domain/organization";
import type { Workspace } from "@/domain/workspace";

describe("Organization and Workspace domain", () => {
  it("keeps workspace ownership scoped to an organization", () => {
    const organization: Organization = {
      id: "org-001",
      name: "Kelly Legacy Institute",
      slug: "kelly-legacy-institute",
      type: "KLI_INTERNAL",
      status: "ACTIVE",
      integrityStatus: "VERIFIED",
      createdAt: "2026-09-15T21:00:00Z",
      updatedAt: "2026-09-15T21:00:00Z",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    const workspace: Workspace = {
      id: "workspace-001",
      organizationId: organization.id,
      name: "Internal Institutional Records",
      slug: "internal-records",
      type: "INTERNAL",
      status: "ACTIVE",
      integrityStatus: "VERIFIED",
      createdAt: "2026-09-15T21:00:00Z",
      updatedAt: "2026-09-15T21:00:00Z",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(workspace.organizationId).toBe(organization.id);
  });
});
