import { describe, expect, it } from "vitest";

import type { MachineFinding } from "@/domain/machineFinding";
import {
  assertMachineFindingMatchesScope,
  assertMachineFindingScopeImmutable,
} from "@/lib/institutional/machineFindingValidation";

function buildMachineFinding(
  overrides: Partial<MachineFinding> = {},
): MachineFinding {
  return {
    id: "finding-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterId: "matter-001",
    sourceRunId: "run-001",
    findingType: "CITATION_CANDIDATE",
    findingText: "Potential authority identified.",
    generatedAt: "2026-09-16T00:00:00Z",
    disposition: "PROPOSED",
    ...overrides,
  };
}

describe("machine finding validation", () => {
  it("accepts exact Matter scope", () => {
    expect(() =>
      assertMachineFindingMatchesScope(buildMachineFinding(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        recordId: "finding-001",
      }),
    ).not.toThrow();
  });

  it("rejects cross-Matter scope", () => {
    expect(() =>
      assertMachineFindingMatchesScope(buildMachineFinding(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-999",
        recordId: "finding-001",
      }),
    ).toThrow("MachineFinding matter scope mismatch.");
  });

  it("prevents scope migration", () => {
    expect(() =>
      assertMachineFindingScopeImmutable(
        buildMachineFinding(),
        buildMachineFinding({ workspaceId: "workspace-999" }),
      ),
    ).toThrow("MachineFinding workspace scope is immutable.");
  });
});
