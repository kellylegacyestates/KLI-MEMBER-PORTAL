import { describe, expect, it } from "vitest";

import type { Evidence } from "@/domain/evidence";

describe("Evidence domain", () => {
  it("keeps received evidence distinct from authenticated evidence", () => {
    const evidence: Evidence = {
      id: "evidence-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      title: "Received Agency Record",
      evidenceType: "DOCUMENT",
      status: "RECEIVED",
      integrityStatus: "UNREVIEWED",
      receivedAt: "2026-09-15T21:00:00Z",
      provenance: {
        sourceType: "AGENCY_PRODUCTION",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(evidence.status).toBe("RECEIVED");
    expect(evidence.authenticatedAt).toBeUndefined();
    expect(evidence.admittedAt).toBeUndefined();
  });
});
