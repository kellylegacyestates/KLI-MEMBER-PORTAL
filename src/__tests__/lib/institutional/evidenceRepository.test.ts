import { describe, expect, it } from "vitest";

import { evidenceDocumentPath } from "@/lib/institutional/tenantPaths";
import {
  assertEvidenceMatchesScope,
  assertEvidenceScopeImmutable,
} from "@/lib/institutional/evidenceValidation";
import type { Evidence } from "@/domain/evidence";

function buildEvidence(
  overrides: Partial<Evidence> = {},
): Evidence {
  return {
    id: "evidence-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    matterId: "matter-001",
    title: "Repository Evidence",
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

describe("evidence repository contract", () => {
  it("uses the canonical Matter-scoped path", () => {
    expect(
      evidenceDocumentPath(
        "org-001",
        "workspace-001",
        "matter-001",
        "evidence-001",
      ),
    ).toBe(
      "organizations/org-001/workspaces/workspace-001/matters/matter-001/evidence/evidence-001",
    );
  });

  it("rejects scope drift on stored evidence", () => {
    expect(() =>
      assertEvidenceMatchesScope(buildEvidence(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-999",
        evidenceId: "evidence-001",
      }),
    ).toThrow("Evidence matter scope mismatch.");
  });

  it("prevents evidence migration on update", () => {
    expect(() =>
      assertEvidenceScopeImmutable(
        buildEvidence(),
        buildEvidence({ matterId: "matter-999" }),
      ),
    ).toThrow("Evidence matter scope is immutable.");
  });
});
