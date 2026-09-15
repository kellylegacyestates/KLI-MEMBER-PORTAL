import { describe, expect, it } from "vitest";

import type { Remedy } from "@/domain/remedy";
import type { Review } from "@/domain/review";

describe("Review and Remedy domain", () => {
  it("does not equate available review with exhausted review", () => {
    const review: Review = {
      id: "review-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      reviewType: "ADMINISTRATIVE_REVIEW",
      status: "AVAILABLE",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(review.status).toBe("AVAILABLE");
    expect(review.status).not.toBe("EXHAUSTED");
  });

  it("requires remedy status to be represented explicitly", () => {
    const remedy: Remedy = {
      id: "remedy-001",
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      remedyType: "ADMINISTRATIVE_APPEAL",
      status: "AVAILABLE",
      integrityStatus: "UNREVIEWED",
      provenance: {
        sourceType: "TEST",
        createdBy: "user-001",
        createdAt: "2026-09-15T21:00:00Z",
        creationMethod: "HUMAN",
      },
    };

    expect(remedy.status).toBe("AVAILABLE");
    expect(remedy.exhaustionDate).toBeUndefined();
  });
});
