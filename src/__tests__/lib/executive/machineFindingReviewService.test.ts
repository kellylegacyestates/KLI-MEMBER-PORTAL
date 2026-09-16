import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MachineFinding } from "@/domain/machineFinding";

vi.mock("@/lib/auth/server", () => ({
  requireExecutive: vi.fn(),
}));

vi.mock("@/lib/institutional", () => ({
  getMachineFinding: vi.fn(),
  updateMachineFinding: vi.fn(),
  appendAuditEvent: vi.fn(),
}));

import { requireExecutive } from "@/lib/auth/server";
import {
  appendAuditEvent,
  getMachineFinding,
  updateMachineFinding,
} from "@/lib/institutional";
import {
  beginExecutiveMachineFindingReview,
  disposeExecutiveMachineFinding,
} from "@/lib/executive/machineFindingReviewService";

const requireExecutiveMock = vi.mocked(requireExecutive);
const getMachineFindingMock = vi.mocked(getMachineFinding);
const updateMachineFindingMock = vi.mocked(updateMachineFinding);
const appendAuditEventMock = vi.mocked(appendAuditEvent);

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

function authorizeExecutive(): void {
  requireExecutiveMock.mockResolvedValue({
    kind: "authorized",
    user: {
      uid: "user-001",
      claims: {} as never,
    },
    profile: {
      uid: "user-001",
      email: "",
      displayName: "",
      institution: "",
      membershipPurpose: "",
      role: "executive",
      accountStatus: "active",
      membershipStatus: "active",
      createdAt: null,
      updatedAt: null,
    },
  });
}

describe("machineFindingReviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorizeExecutive();
  });

  it("fails closed when executive authorization is absent", async () => {
    requireExecutiveMock.mockResolvedValue({
      kind: "unauthenticated",
    });

    await expect(
      beginExecutiveMachineFindingReview({
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        machineFindingId: "finding-001",
        auditEventId: "audit-001",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    ).rejects.toThrow("Executive authorization required.");

    expect(getMachineFindingMock).not.toHaveBeenCalled();
    expect(updateMachineFindingMock).not.toHaveBeenCalled();
    expect(appendAuditEventMock).not.toHaveBeenCalled();
  });

  it("fails closed when the MachineFinding does not exist", async () => {
    getMachineFindingMock.mockResolvedValue(null);

    await expect(
      beginExecutiveMachineFindingReview({
        organizationId: "org-001",
        workspaceId: "workspace-001",
        matterId: "matter-001",
        machineFindingId: "finding-001",
        auditEventId: "audit-001",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    ).rejects.toThrow("MachineFinding not found: finding-001");

    expect(updateMachineFindingMock).not.toHaveBeenCalled();
    expect(appendAuditEventMock).not.toHaveBeenCalled();
  });

  it("moves a proposed finding into review and appends an audit event", async () => {
    getMachineFindingMock.mockResolvedValue(finding());

    await beginExecutiveMachineFindingReview({
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      machineFindingId: "finding-001",
      auditEventId: "audit-001",
      reviewedAt: "2026-09-16T01:00:00Z",
    });

    expect(updateMachineFindingMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "finding-001",
        disposition: "UNDER_REVIEW",
        reviewedBy: "user-001",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    );

    expect(appendAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "audit-001",
        actorType: "USER",
        actorId: "user-001",
        action: "BEGIN_MACHINE_FINDING_REVIEW",
        resourceType: "MachineFinding",
        resourceId: "finding-001",
      }),
    );
  });

  it("disposes an under-review finding and appends an audit event", async () => {
    getMachineFindingMock.mockResolvedValue(
      finding({
        disposition: "UNDER_REVIEW",
        reviewedBy: "user-001",
        reviewedAt: "2026-09-16T01:00:00Z",
      }),
    );

    await disposeExecutiveMachineFinding({
      organizationId: "org-001",
      workspaceId: "workspace-001",
      matterId: "matter-001",
      machineFindingId: "finding-001",
      auditEventId: "audit-002",
      reviewedAt: "2026-09-16T01:05:00Z",
      disposition: "ADOPTED",
    });

    expect(updateMachineFindingMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "finding-001",
        disposition: "ADOPTED",
        reviewedBy: "user-001",
        reviewedAt: "2026-09-16T01:05:00Z",
      }),
    );

    expect(appendAuditEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "audit-002",
        actorType: "USER",
        actorId: "user-001",
        action: "DISPOSE_MACHINE_FINDING",
        resourceType: "MachineFinding",
        resourceId: "finding-001",
      }),
    );
  });
});
