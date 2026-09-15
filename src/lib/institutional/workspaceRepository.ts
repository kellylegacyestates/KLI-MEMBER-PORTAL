import "server-only";

import type {
  OrganizationId,
  WorkspaceId,
} from "@/domain/shared";
import type { Workspace } from "@/domain/workspace";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

import { workspaceDocumentPath } from "./tenantPaths";

function workspaceRef(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
) {
  return getFirebaseAdminDb().doc(
    workspaceDocumentPath(
      organizationId,
      workspaceId,
    ),
  );
}

export async function getWorkspace(
  organizationId: OrganizationId,
  workspaceId: WorkspaceId,
): Promise<Workspace | null> {
  const snapshot = await workspaceRef(
    organizationId,
    workspaceId,
  ).get();

  if (!snapshot.exists) {
    return null;
  }

  const workspace = snapshot.data() as Workspace;

  if (workspace.organizationId !== organizationId) {
    throw new Error(
      "Workspace organization scope mismatch.",
    );
  }

  if (workspace.id !== workspaceId) {
    throw new Error("Workspace document ID mismatch.");
  }

  return workspace;
}

export async function createWorkspace(
  workspace: Workspace,
): Promise<void> {
  if (workspace.id.trim().length === 0) {
    throw new Error("Workspace ID is required.");
  }

  if (workspace.organizationId.trim().length === 0) {
    throw new Error(
      "Workspace organization ID is required.",
    );
  }

  const ref = workspaceRef(
    workspace.organizationId,
    workspace.id,
  );

  const existing = await ref.get();

  if (existing.exists) {
    throw new Error(
      `Workspace already exists: ${workspace.id}`,
    );
  }

  await ref.create(workspace);
}
