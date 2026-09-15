import { describe, expect, it } from "vitest";

import {
  membershipDocumentPath,
  organizationDocumentPath,
  workspaceDocumentPath,
} from "@/lib/institutional/tenantPaths";

describe("tenant persistence paths", () => {
  it("uses the canonical organization path", () => {
    expect(
      organizationDocumentPath("org-001"),
    ).toBe("organizations/org-001");
  });

  it("nests workspaces beneath their organization", () => {
    expect(
      workspaceDocumentPath("org-001", "workspace-001"),
    ).toBe(
      "organizations/org-001/workspaces/workspace-001",
    );
  });

  it("nests memberships beneath their organization", () => {
    expect(
      membershipDocumentPath("org-001", "membership-001"),
    ).toBe(
      "organizations/org-001/memberships/membership-001",
    );
  });
});
