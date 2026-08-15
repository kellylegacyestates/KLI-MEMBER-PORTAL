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
}));

import { writeAuditEvent } from "@/lib/auth/audit";
import { requireAdmin } from "@/lib/auth/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { POST as revokeAsAdmin } from "@/app/api/admin/users/revoke-sessions/route";
import { POST as revokeOwnSessions } from "@/app/api/auth/logout-all/route";

const mockAudit = vi.mocked(writeAuditEvent);
const mockRequireAdmin = vi.mocked(requireAdmin);
const mockGetAuth = vi.mocked(getFirebaseAdminAuth);

function post(path: string, body?: object, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: {
      origin: "http://localhost",
      ...(cookie ? { cookie: `__session=${cookie}` } : {}),
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("administrative session revocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudit.mockResolvedValue();
    mockRequireAdmin.mockResolvedValue({
      kind: "authorized",
      user: { uid: "admin-1", claims: {} as never },
      profile: {} as never,
    });
  });

  it("revokes the target and writes an audit event", async () => {
    const revokeRefreshTokens = vi.fn().mockResolvedValue(undefined);
    mockGetAuth.mockReturnValue({ revokeRefreshTokens } as never);

    const response = await revokeAsAdmin(
      post("/api/admin/users/revoke-sessions", {
        targetUid: "member-1",
        reason: "Reported lost institutional device",
      })
    );

    expect(response.status).toBe(200);
    expect(revokeRefreshTokens).toHaveBeenCalledWith("member-1");
    expect(mockAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        actorUid: "admin-1",
        targetUid: "member-1",
        outcome: "success",
      })
    );
  });

  it("rejects non-admin callers", async () => {
    mockRequireAdmin.mockResolvedValue({ kind: "unauthenticated" });

    const response = await revokeAsAdmin(
      post("/api/admin/users/revoke-sessions", {
        targetUid: "member-1",
        reason: "Reported lost institutional device",
      })
    );

    expect(response.status).toBe(401);
    expect(mockGetAuth).not.toHaveBeenCalled();
  });
});

describe("self-service all-device sign out", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudit.mockResolvedValue();
  });

  it("derives the user from the session, revokes tokens, and clears the cookie", async () => {
    const verifySessionCookie = vi.fn().mockResolvedValue({ uid: "member-1" });
    const revokeRefreshTokens = vi.fn().mockResolvedValue(undefined);
    mockGetAuth.mockReturnValue({
      verifySessionCookie,
      revokeRefreshTokens,
    } as never);

    const response = await revokeOwnSessions(
      post("/api/auth/logout-all", undefined, "valid-session")
    );

    expect(response.status).toBe(200);
    expect(verifySessionCookie).toHaveBeenCalledWith("valid-session", true);
    expect(revokeRefreshTokens).toHaveBeenCalledWith("member-1");
    expect(response.headers.get("set-cookie")).toMatch(/__session=.*max-age=0/i);
  });

  it("clears an invalid session cookie without revoking a user", async () => {
    const verifySessionCookie = vi.fn().mockRejectedValue(new Error("expired"));
    const revokeRefreshTokens = vi.fn();
    mockGetAuth.mockReturnValue({
      verifySessionCookie,
      revokeRefreshTokens,
    } as never);

    const response = await revokeOwnSessions(
      post("/api/auth/logout-all", undefined, "expired-session")
    );

    expect(response.status).toBe(401);
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toContain("__session=");
  });
});
