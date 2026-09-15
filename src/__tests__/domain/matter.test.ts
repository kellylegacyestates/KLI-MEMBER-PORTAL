import { describe, expect, it } from "vitest";

import type { Matter } from "@/domain/matter";

describe("Matter domain", () => {
  it("requires organization and workspace scope", () => {
    const matter: Matter = {
      id: "matter-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterNumber: "KLI-2026-001",
      title: "Institutional Domain Test Matter",
      matterType: "INTERNAL_GOVERNANCE",
      status: "OPEN",
      integrityStatus: "UNREVIEWED",
      createdAt: "2026-09-15T21:00:00Z",
      updatedAt: "2026-09-15T21:00:00Z",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(matter.organizationId).toBe("org-001");
    expect(matter.workspaceId).toBe("workspace-001");
    expect(matter.status).toBe("OPEN");
  });

  it("keeps record integrity independent from matter lifecycle", () => {
    const matter: Matter = {
      id: "matter-002",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterNumber: "KLI-2026-002",
      title: "Integrity Separation Test",
      matterType: "RESEARCH",
      status: "UNDER_REVIEW",
      integrityStatus: "DISPUTED",
      createdAt: "2026-09-15T21:00:00Z",
      updatedAt: "2026-09-15T21:00:00Z",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(matter.status).toBe("UNDER_REVIEW");
    expect(matter.integrityStatus).toBe("DISPUTED");
  });
});
