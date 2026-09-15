import { describe, expect, it } from "vitest";

import type { Authority } from "@/domain/authority";

describe("Authority domain", () => {
  it("keeps extracted authority distinct from verified authority", () => {
    const authority: Authority = {
      id: "authority-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      authorityType: "STATUTE",
      title: "Candidate Statutory Authority",
      citation: "Example Citation",
      verificationStatus: "CANDIDATE",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "DOCUMENT_EXTRACTION",
        createdBy: "system-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "LDIE_PROPOSAL",
        machineRunId: "run-001",
      },
    };

    expect(authority.verificationStatus).toBe("CANDIDATE");
    expect(authority.verificationStatus).not.toBe("VERIFIED");
  });
});
