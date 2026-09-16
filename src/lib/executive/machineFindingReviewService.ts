import type { AuditEvent } from "@/domain/auditEvent";
import type {
  MachineFindingId,
  MatterId,
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import { requireExecutive } from "@/lib/auth/server";
import {
  appendAuditEvent,
  getMachineFinding,
  updateMachineFinding,
} from "@/lib/institutional";

import {
  beginMachineFindingReview,
  disposeMachineFinding,
  type FinalMachineFindingDisposition,
} from "./machineFindingDisposition";

export interface MachineFindingReviewScope {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  matterId: MatterId;
  machineFindingId: MachineFindingId;
}

export interface BeginExecutiveReviewInput
  extends MachineFindingReviewScope {
  auditEventId: string;
  reviewedAt: string;
}

export interface DisposeExecutiveReviewInput
  extends MachineFindingReviewScope {
  auditEventId: string;
  reviewedAt: string;
  disposition: FinalMachineFindingDisposition;
}

async function requireExecutiveReviewer() {
  const authorization = await requireExecutive();

  if (authorization.kind !== "authorized") {
    throw new Error("Executive authorization required.");
  }

  return authorization.user.uid;
}

async function loadFinding(
  scope: MachineFindingReviewScope,
) {
  const finding = await getMachineFinding(
    scope.organizationId,
    scope.workspaceId,
    scope.matterId,
    scope.machineFindingId,
  );

  if (!finding) {
    throw new Error(
      `MachineFinding not found: ${scope.machineFindingId}`,
    );
  }

  return finding;
}

function buildAuditEvent(
  input: {
    auditEventId: string;
    organizationId: OrganizationId;
    workspaceId: WorkspaceId;
    reviewerId: string;
    machineFindingId: MachineFindingId;
    action: string;
    occurredAt: string;
    disposition: string;
  },
): AuditEvent {
  return {
    id: input.auditEventId,
    organizationId: input.organizationId,
    workspaceId: input.workspaceId,
    actorType: "USER",
    actorId: input.reviewerId,
    action: input.action,
    resourceType: "MachineFinding",
    resourceId: input.machineFindingId,
    occurredAt: input.occurredAt,
    createdBy: input.reviewerId,
    metadata: {
      disposition: input.disposition,
    },
  };
}

export async function beginExecutiveMachineFindingReview(
  input: BeginExecutiveReviewInput,
): Promise<void> {
  const reviewerId = await requireExecutiveReviewer();
  const current = await loadFinding(input);

  const next = beginMachineFindingReview({
    current,
    reviewerId,
    reviewedAt: input.reviewedAt,
  });

  await updateMachineFinding(next);

  await appendAuditEvent(
    buildAuditEvent({
      auditEventId: input.auditEventId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      reviewerId,
      machineFindingId: input.machineFindingId,
      action: "BEGIN_MACHINE_FINDING_REVIEW",
      occurredAt: input.reviewedAt,
      disposition: next.disposition,
    }),
  );
}

export async function disposeExecutiveMachineFinding(
  input: DisposeExecutiveReviewInput,
): Promise<void> {
  const reviewerId = await requireExecutiveReviewer();
  const current = await loadFinding(input);

  const next = disposeMachineFinding({
    current,
    reviewerId,
    reviewedAt: input.reviewedAt,
    disposition: input.disposition,
  });

  await updateMachineFinding(next);

  await appendAuditEvent(
    buildAuditEvent({
      auditEventId: input.auditEventId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      reviewerId,
      machineFindingId: input.machineFindingId,
      action: "DISPOSE_MACHINE_FINDING",
      occurredAt: input.reviewedAt,
      disposition: next.disposition,
    }),
  );
}
