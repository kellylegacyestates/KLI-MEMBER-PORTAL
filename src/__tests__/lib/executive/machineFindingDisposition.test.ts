import { describe, expect, it } from "vitest";

import type { MachineFinding } from "@/domain/machineFinding";
import {
  beginMachineFindingReview,
  disposeMachineFinding,
  isFinalMachineFindingDisposition,
} from "@/lib/executive/machineFindingDisposition";

function finding(
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
    integrityStatus: "UNREVIEWED",
    provenance: {
      sourceType: "LDIE",
      createdBy: "ldie",
      createdAt: "2026-09-16T00:00:00Z",
      creationMethod: "LDIE_PROPOSAL",
    },
    ...overrides,
  };
}

describe("beginMachineFindingReview", () => {
  it("moves PROPOSED to UNDER_REVIEW", () => {
    const next = beginMachineFindingReview({
      current: finding(),
      reviewerId: "user-001",
      reviewedAt: "2026-09-16T01:00:00Z",
    });

    expect(next.disposition).toBe("UNDER_REVIEW");
    expect(next.reviewedBy).toBe("user-001");
    expect(next.reviewedAt).toBe("2026-09-16T01:00:00Z");
  });

  it("rejects review from a non-PROPOSED state", () => {
    expect(() =>
      beginMachineFindingReview({
        current: finding({ disposition: "ADOPTED" }),
        reviewerId: "user-001",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    ).toThrow(
      "Only PROPOSED MachineFinding records may enter review.",
    );
  });

  it("requires reviewer identity", () => {
    expect(() =>
      beginMachineFindingReview({
        current: finding(),
        reviewerId: "",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    ).toThrow("MachineFinding reviewer ID is required.");
  });

  it("requires review timestamp", () => {
    expect(() =>
      beginMachineFindingReview({
        current: finding(),
        reviewerId: "user-001",
        reviewedAt: "",
      }),
    ).toThrow("MachineFinding review timestamp is required.");
  });
});

describe("disposeMachineFinding", () => {
  const underReview = finding({
    disposition: "UNDER_REVIEW",
    reviewedBy: "user-001",
    reviewedAt: "2026-09-16T01:00:00Z",
  });

  it.each([
    "ADOPTED",
    "REJECTED",
    "SUPERSEDED",
  ] as const)("allows final disposition %s", (disposition) => {
    const next = disposeMachineFinding({
      current: underReview,
      reviewerId: "user-001",
      reviewedAt: "2026-09-16T01:05:00Z",
      disposition,
    });

    expect(next.disposition).toBe(disposition);
    expect(next.reviewedBy).toBe("user-001");
    expect(next.reviewedAt).toBe("2026-09-16T01:05:00Z");
  });

  it("rejects disposition from a non-review state", () => {
    expect(() =>
      disposeMachineFinding({
        current: finding(),
        reviewerId: "user-001",
        reviewedAt: "2026-09-16T01:05:00Z",
        disposition: "ADOPTED",
      }),
    ).toThrow(
      "Only UNDER_REVIEW MachineFinding records may be disposed.",
    );
  });

  it("prevents reviewer substitution", () => {
    expect(() =>
      disposeMachineFinding({
        current: underReview,
        reviewerId: "user-999",
        reviewedAt: "2026-09-16T01:05:00Z",
        disposition: "REJECTED",
      }),
    ).toThrow(
      "MachineFinding reviewer identity cannot change during disposition.",
    );
  });
});

describe("isFinalMachineFindingDisposition", () => {
  it("recognizes final dispositions", () => {
    expect(isFinalMachineFindingDisposition("ADOPTED")).toBe(true);
    expect(isFinalMachineFindingDisposition("REJECTED")).toBe(true);
    expect(isFinalMachineFindingDisposition("SUPERSEDED")).toBe(true);
  });

  it("rejects non-final dispositions", () => {
    expect(isFinalMachineFindingDisposition("PROPOSED")).toBe(false);
    expect(isFinalMachineFindingDisposition("UNDER_REVIEW")).toBe(false);
  });
});
