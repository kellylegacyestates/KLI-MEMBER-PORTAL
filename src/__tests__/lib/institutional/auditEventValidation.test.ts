import { describe, expect, it } from "vitest";

import type { AuditEvent } from "@/domain/auditEvent";
import {
  assertAuditEventMatchesScope,
  assertWorkspaceScopedAuditEvent,
} from "@/lib/institutional/auditEventValidation";

function buildAuditEvent(
  overrides: Partial<AuditEvent> = {},
): AuditEvent {
  return {
    id: "audit-001",
    organizationId: "org-001",
    workspaceId: "workspace-001",
    actorType: "SYSTEM",
    actorId: "system",
    action: "CREATE_RECORD",
    resourceType: "MachineFinding",
    resourceId: "finding-001",
    occurredAt: "2026-09-16T00:00:00Z",
    ...overrides,
  };
}

describe("audit event validation", () => {
  it("accepts exact workspace scope", () => {
    expect(() =>
      assertAuditEventMatchesScope(buildAuditEvent(), {
        organizationId: "org-001",
        workspaceId: "workspace-001",
        auditEventId: "audit-001",
      }),
    ).not.toThrow();
  });

  it("rejects workspace mismatch", () => {
    expect(() =>
      assertAuditEventMatchesScope(buildAuditEvent(), {
        organizationId: "org-001",
        workspaceId: "workspace-999",
        auditEventId: "audit-001",
      }),
    ).toThrow("AuditEvent workspace scope mismatch.");
  });

  it("requires workspace-scoped audit events", () => {
    expect(() =>
      assertWorkspaceScopedAuditEvent(
        buildAuditEvent({ workspaceId: undefined }),
      ),
    ).toThrow("AuditEvent workspace ID is required.");
  });
});
