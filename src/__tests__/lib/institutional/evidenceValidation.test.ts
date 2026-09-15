import { describe, expect, it } from "vitest";

import type { Evidence } from "@/domain/evidence";
import {
  assertEvidenceMatchesScope,
  assertEvidenceScopeImmutable,
  evidenceMatchesScope,
} from "@/lib/institutional/evidenceValidation";

function buildEvidence(
  overrides: Partial<Evidence> = {},
): Evidence {
  return {
    id: "evidence-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterId: "matter-001",
    title: "Evidence Test",
    evidenceType: "DOCUMENT",
    status: "RECEIVED",
    integrityStatus: "UNREVIEWED",
    provenance: {
      sourceType: "TEST",
      createdBy: "user-001",
      createdAt: "2026-09-15T22:00:00Z",
      creationMethod: "HUMAN",
    },
    ...overrides,
  };
}

describe("evidence validation", () => {
  it("accepts exact scope", () => {
    expect(
      evidenceMatchesScope(buildEvidence(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        evidenceId: "evidence-001",
      }),
    ).toBe(true);
  });

  it("rejects cross-matter scope", () => {
    expect(() =>
      assertEvidenceMatchesScope(buildEvidence(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-999",
        evidenceId: "evidence-001",
      }),
    ).toThrow("Evidence matter scope mismatch.");
  });

  it("prevents evidence scope mutation", () => {
    expect(() =>
      assertEvidenceScopeImmutable(
        buildEvidence(),
        buildEvidence({ workspaceId: "workspace-999" }),
      ),
    ).toThrow("Evidence workspace scope is immutable.");
  });
});
