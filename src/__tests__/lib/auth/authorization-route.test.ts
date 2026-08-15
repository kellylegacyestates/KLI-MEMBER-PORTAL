import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/server", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/auth/audit", () => ({
  writeAuditEvent: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
  getFirebaseAdminDb: vi.fn(),
}));

import { writeAuditEvent } from "@/lib/auth/audit";
import { requireAdmin } from "@/lib/auth/server";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";
import { POST } from "@/app/api/admin/users/authorization/route";

const mockAudit = vi.mocked(writeAuditEvent);
const mockRequireAdmin = vi.mocked(requireAdmin);
const mockGetAuth = vi.mocked(getFirebaseAdminAuth);
const mockGetDb = vi.mocked(getFirebaseAdminDb);

const activeMember = {
  role: "member",
  accountStatus: "active",
  membershipStatus: "active",
  displayName: "Preserved",
};

function post(body?: object) {
  return new NextRequest("http://localhost/api/admin/users/authorization", {
    method: "POST",
    headers: {
      origin: "http://localhost",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function createFirestore(profile: Record<string, unknown> | null = activeMember) {
  const refs = new Map<string, { path: string }>();
  const ref = (collection: string, id: string) => {
    const path = `${collection}/${id}`;
    const existing = refs.get(path);
    if (existing) return existing;
    const created = { path };
    refs.set(path, created);
    return created;
  };
  const update = vi.fn();
  const create = vi.fn();
  const get = vi.fn(async () => ({
    exists: profile !== null,
    data: () => profile ?? undefined,
  }));
  const transaction = { get, update, create };
  const runTransaction = vi.fn(async (callback) => callback(transaction));
  let auditId = 0;
  const db = {
    collection: vi.fn((name: string) => ({
      doc: (id?: string) => ref(name, id ?? `audit-${++auditId}`),
    })),
    runTransaction,
  };
  mockGetDb.mockReturnValue(db as never);
  return { create, db, get, runTransaction, update };
}

async function json(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("administrative authorization updates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({
      kind: "authorized",
      user: { uid: "admin-1", claims: {} as never },
      profile: {} as never,
    });
    mockAudit.mockResolvedValue();
    mockGetAuth.mockReturnValue({
      revokeRefreshTokens: vi.fn().mockResolvedValue(undefined),
    } as never);
  });

  it("denies unauthenticated requests", async () => {
    mockRequireAdmin.mockResolvedValue({ kind: "unauthenticated" });

    const response = await POST(post({ uid: "member-1", role: "executive", reason: "Approved" }));

    expect(response.status).toBe(401);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("denies non-admin requests", async () => {
    mockRequireAdmin.mockResolvedValue({
      kind: "forbidden",
      user: { uid: "member-2", claims: {} as never },
      profile: {} as never,
    });

    const response = await POST(post({ uid: "member-1", role: "executive", reason: "Approved" }));

    expect(response.status).toBe(403);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("denies missing target profiles", async () => {
    createFirestore(null);

    const response = await POST(post({ uid: "missing", role: "executive", reason: "Approved" }));

    expect(response.status).toBe(404);
    expect(await json(response)).toMatchObject({ ok: false });
  });

  it.each([
    ["role", "owner"],
    ["accountStatus", "disabled"],
    ["membershipStatus", "cancelled"],
  ])("denies an invalid %s", async (field, value) => {
    const response = await POST(
      post({ uid: "member-1", [field]: value, reason: "Approved" })
    );

    expect(response.status).toBe(400);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it.each([undefined, "", "   "])("denies a missing or blank reason", async (reason) => {
    const response = await POST(post({ uid: "member-1", role: "executive", reason }));

    expect(response.status).toBe(400);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("requires at least one authorization field", async () => {
    const response = await POST(post({ uid: "member-1", reason: "Approved" }));

    expect(response.status).toBe(400);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it.each([
    ["role", "executive"],
    ["accountStatus", "suspended"],
    ["membershipStatus", "suspended"],
  ] as const)("updates a valid %s change", async (field, value) => {
    const firestore = createFirestore();

    const response = await POST(
      post({ uid: "member-1", [field]: value, reason: "Approved by governance" })
    );

    expect(response.status).toBe(200);
    expect(await json(response)).toMatchObject({ ok: true, changed: true });
    expect(firestore.update).toHaveBeenCalledWith(
      { path: "users/member-1" },
      expect.objectContaining({ [field]: value, updatedAt: expect.anything() })
    );
  });

  it("writes the actor, target, action, reason, outcome, and full old/new state", async () => {
    const firestore = createFirestore();

    await POST(
      post({
        uid: "member-1",
        role: "executive",
        membershipStatus: "suspended",
        reason: "  Governance decision  ",
      })
    );

    expect(firestore.create).toHaveBeenCalledWith(
      { path: "auditEvents/audit-1" },
      {
        action: "user.authorization.update",
        actorUid: "admin-1",
        targetUid: "member-1",
        oldValue: {
          role: "member",
          accountStatus: "active",
          membershipStatus: "active",
        },
        newValue: {
          role: "executive",
          accountStatus: "active",
          membershipStatus: "suspended",
        },
        timestamp: expect.anything(),
        reason: "Governance decision",
        outcome: "success",
      }
    );
  });

  it("returns a safe no-op response without writing an audit event", async () => {
    const firestore = createFirestore();

    const response = await POST(
      post({ uid: "member-1", role: "member", reason: "Verification only" })
    );

    expect(await json(response)).toEqual({
      ok: true,
      changed: false,
      sessionsRevoked: false,
    });
    expect(firestore.update).not.toHaveBeenCalled();
    expect(firestore.create).not.toHaveBeenCalled();
  });

  it.each([
    { role: "executive" },
    { accountStatus: "suspended" },
    { accountStatus: "revoked" },
    { membershipStatus: "suspended" },
    { membershipStatus: "revoked" },
  ])("blocks unsafe self-modification for $role$accountStatus$membershipStatus", async (change) => {
    const response = await POST(post({ uid: "admin-1", ...change, reason: "Self change" }));

    expect(response.status).toBe(409);
    expect(mockGetDb).not.toHaveBeenCalled();
  });

  it("revokes refresh tokens after an access-reducing change", async () => {
    createFirestore({
      ...activeMember,
      role: "admin",
    });
    const revokeRefreshTokens = vi.fn().mockResolvedValue(undefined);
    mockGetAuth.mockReturnValue({ revokeRefreshTokens } as never);

    const response = await POST(
      post({ uid: "admin-2", role: "executive", reason: "Duties changed" })
    );

    expect(revokeRefreshTokens).toHaveBeenCalledWith("admin-2");
    expect(await json(response)).toMatchObject({ sessionsRevoked: true });
  });

  it("does not revoke sessions for a non-access-reducing change", async () => {
    createFirestore();
    const revokeRefreshTokens = vi.fn();
    mockGetAuth.mockReturnValue({ revokeRefreshTokens } as never);

    const response = await POST(
      post({ uid: "member-1", role: "executive", reason: "Leadership appointment" })
    );

    expect(revokeRefreshTokens).not.toHaveBeenCalled();
    expect(await json(response)).toMatchObject({ sessionsRevoked: false });
  });

  it("reports partial success and audits a post-commit revocation failure", async () => {
    createFirestore();
    mockGetAuth.mockReturnValue({
      revokeRefreshTokens: vi.fn().mockRejectedValue(new Error("unavailable")),
    } as never);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(
      post({ uid: "member-1", accountStatus: "revoked", reason: "Security response" })
    );

    expect(response.status).toBe(207);
    expect(await json(response)).toMatchObject({
      ok: true,
      changed: true,
      sessionsRevoked: false,
    });
    expect(mockAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "admin.sessions.revoke",
        actorUid: "admin-1",
        targetUid: "member-1",
        outcome: "failure",
      })
    );
    consoleError.mockRestore();
  });

  it("uses one Firestore transaction for the profile update and audit creation", async () => {
    const firestore = createFirestore();

    await POST(
      post({ uid: "member-1", role: "executive", reason: "Leadership appointment" })
    );

    expect(firestore.runTransaction).toHaveBeenCalledOnce();
    expect(firestore.get).toHaveBeenCalledWith({ path: "users/member-1" });
    expect(firestore.update).toHaveBeenCalledOnce();
    expect(firestore.create).toHaveBeenCalledOnce();
  });

  it("keeps audit events inaccessible to browser clients", () => {
    const rules = readFileSync("firestore.rules", "utf8");

    expect(rules).toMatch(
      /match \/auditEvents\/\{eventId\}\s*\{\s*allow read, write: if false;\s*\}/
    );
  });
});
