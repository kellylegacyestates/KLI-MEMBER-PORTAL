import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuditEvent } from "@/domain/auditEvent";
import type { MachineFinding } from "@/domain/machineFinding";

vi.mock("@/lib/institutional", () => ({
  createMachineFinding: vi.fn(),
  appendAuditEvent: vi.fn(),
}));

import {
  appendAuditEvent,
  createMachineFinding,
} from "@/lib/institutional";
import { persistLdieFinding } from "@/lib/ldie/persistFinding";

const createFindingMock = vi.mocked(createMachineFinding);
const appendAuditMock = vi.mocked(appendAuditEvent);

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
    ...overrides,
  };
}

function audit(
  overrides: Partial<AuditEvent> = {},
): AuditEvent {
  return {
    id: "audit-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    actorType: "LDIE",
    actorId: "ldie",
    action: "CREATE_MACHINE_FINDING",
    resourceType: "MachineFinding",
    resourceId: "finding-001",
    occurredAt: "2026-09-16T00:00:01Z",
    ...overrides,
  };
}

describe("persistLdieFinding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists a proposed finding and matching audit event", async () => {
    const record = finding();
    const event = audit();

    await persistLdieFinding({
      finding: record,
      auditEvent: event,
    });

    expect(createFindingMock).toHaveBeenCalledWith(record);
    expect(appendAuditMock).toHaveBeenCalledWith(event);
  });

  it("rejects a non-proposed finding", async () => {
    await expect(
      persistLdieFinding({
        finding: finding({ disposition: "ADOPTED" }),
        auditEvent: audit(),
      }),
    ).rejects.toThrow(
      "LDIE may persist only PROPOSED MachineFinding records.",
    );

    expect(createFindingMock).not.toHaveBeenCalled();
    expect(appendAuditMock).not.toHaveBeenCalled();
  });

  it("rejects a non-LDIE audit actor", async () => {
    await expect(
      persistLdieFinding({
        finding: finding(),
        auditEvent: audit({ actorType: "USER" }),
      }),
    ).rejects.toThrow(
      "LDIE persistence requires an LDIE AuditEvent actor.",
    );
  });

  it("rejects a mismatched finding ID", async () => {
    await expect(
      persistLdieFinding({
        finding: finding(),
        auditEvent: audit({ resourceId: "finding-999" }),
      }),
    ).rejects.toThrow(
      "LDIE AuditEvent resource ID must match the MachineFinding ID.",
    );
  });

  it("rejects cross-workspace persistence", async () => {
    await expect(
      persistLdieFinding({
        finding: finding(),
        auditEvent: audit({ workspaceId: "workspace-999" }),
      }),
    ).rejects.toThrow(
      "LDIE AuditEvent workspace scope must match the MachineFinding.",
    );
  });
});
