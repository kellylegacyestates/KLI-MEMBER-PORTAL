
import type { AuditEvent } from "@/domain/auditEvent";
import type { MachineFinding } from "@/domain/machineFinding";
import {
  appendAuditEvent,
  createMachineFinding,
} from "@/lib/institutional";

export interface PersistLdieFindingInput {
  finding: MachineFinding;
  auditEvent: AuditEvent;
}

export async function persistLdieFinding(
  input: PersistLdieFindingInput,
): Promise<void> {
  const { finding, auditEvent } = input;

  if (finding.disposition !== "PROPOSED") {
    throw new Error(
      "LDIE may persist only PROPOSED MachineFinding records.",
    );
  }

  if (auditEvent.actorType !== "LDIE") {
    throw new Error(
      "LDIE persistence requires an LDIE AuditEvent actor.",
    );
  }

  if (auditEvent.resourceType !== "MachineFinding") {
    throw new Error(
      "LDIE AuditEvent must reference a MachineFinding resource.",
    );
  }

  if (auditEvent.resourceId !== finding.id) {
    throw new Error(
      "LDIE AuditEvent resource ID must match the MachineFinding ID.",
    );
  }

  if (auditEvent.organizationId !== finding.organizationId) {
    throw new Error(
      "LDIE AuditEvent organization scope must match the MachineFinding.",
    );
  }

  if (auditEvent.workspaceId !== finding.workspaceId) {
    throw new Error(
      "LDIE AuditEvent workspace scope must match the MachineFinding.",
    );
  }

  await createMachineFinding(finding);
  await appendAuditEvent(auditEvent);
}
