import { describe, expect, it } from "vitest";

import type { Determination } from "@/domain/determination";
import type { MachineFinding } from "@/domain/machineFinding";

describe("MachineFinding domain", () => {
  it("remains distinct from an institutional determination", () => {
    const finding: MachineFinding = {
      id: "finding-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      sourceRunId: "run-001",
      findingType: "AUTHORITY_CANDIDATE",
      findingText: "Candidate authority identified",
      generatedAt: "2026-09-15T21:00:00Z",
      disposition: "PROPOSED",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "LDIE",
        createdBy: "system-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "LDIE_PROPOSAL",
        machineRunId: "run-001",
      },
    };

    const determination: Determination = {
      id: "determination-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      determinationType: "INSTITUTIONAL_REVIEW",
      issueDate: "2026-09-15T21:00:00Z",
      integrityStatus: "VERIFIED",
      provenance: {
        sourceType: "HUMAN_REVIEW",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(finding.disposition).toBe("PROPOSED");
    expect(determination).not.toHaveProperty("disposition", "PROPOSED");
  });
});
