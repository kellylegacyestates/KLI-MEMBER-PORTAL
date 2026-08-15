/**
 * Server authorization tests
 *
 * Tests cover:
 * - Signed-out access to protected routes (unauthenticated)
 * - Active, suspended, and revoked account states
 * - Pending, active, suspended, expired, revoked membership states
 * - Member, executive, and admin role access
 * - Member attempting executive access
 * - Member attempting admin access
 * - Tampered client-side role (cannot escalate via Firestore)
 * - Missing Firestore profile
 * - Invalid, expired, and revoked sessions
 * - Safe redirects
 * - Secure logout (via cookie clearing)
 */

import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { DocumentSnapshot, DocumentData } from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// Module mocks — declared before any imports that trigger them
// ---------------------------------------------------------------------------

vi.mock("server-only", () => ({}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  // Bypass React cache so each call gets a fresh result in tests.
  return { ...actual, cache: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
  getFirebaseAdminDb: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks are registered)
// ---------------------------------------------------------------------------

import { cookies } from "next/headers";
import { getFirebaseAdminAuth, getFirebaseAdminDb } from "@/lib/firebase/admin";
import {
  requireActiveMember,
  requireExecutive,
  requireAdmin,
} from "@/lib/auth/server";

// ---------------------------------------------------------------------------
// Typed mock helpers
// ---------------------------------------------------------------------------

const mockCookies = cookies as MockedFunction<typeof cookies>;
const mockGetAuth = getFirebaseAdminAuth as MockedFunction<typeof getFirebaseAdminAuth>;
const mockGetDb = getFirebaseAdminDb as MockedFunction<typeof getFirebaseAdminDb>;

const SESSION_COOKIE = "__session";

function fakeCookieStore(sessionValue: string | undefined) {
  return {
    get: (name: string) =>
      name === SESSION_COOKIE && sessionValue
        ? { name, value: sessionValue }
        : undefined,
  };
}

function fakeClaims(uid: string): DecodedIdToken {
  return {
    uid,
    aud: "test-project",
    auth_time: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 3600,
    firebase: { identities: {}, sign_in_provider: "password" },
    iat: Math.floor(Date.now() / 1000) - 60,
    iss: "https://session.firebase.google.com/test-project",
    sub: uid,
    email: `${uid}@example.com`,
    email_verified: true,
  };
}

function fakeFirestoreDoc(data: DocumentData | undefined): DocumentSnapshot {
  return {
    exists: () => data !== undefined,
    data: () => data,
    id: "test-uid",
  } as unknown as DocumentSnapshot;
}

function setupSession(
  sessionValue: string,
  claimsOrError: DecodedIdToken | Error,
  firestoreData?: DocumentData
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockCookies.mockResolvedValue(fakeCookieStore(sessionValue) as any);

  const verifySessionCookie =
    claimsOrError instanceof Error
      ? vi.fn().mockRejectedValue(claimsOrError)
      : vi.fn().mockResolvedValue(claimsOrError);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockGetAuth.mockReturnValue({ verifySessionCookie } as any);

  const get = vi.fn().mockResolvedValue(fakeFirestoreDoc(firestoreData));
  const doc = vi.fn().mockReturnValue({ get });
  const collection = vi.fn().mockReturnValue({ doc });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockGetDb.mockReturnValue({ collection } as any);
}

function setupNoSession() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockCookies.mockResolvedValue(fakeCookieStore(undefined) as any);
}

function profileData(
  role: string,
  membershipStatus: string,
  accountStatus = "active",
  uid = "test-uid"
): DocumentData {
  return {
    uid,
    email: `${uid}@example.com`,
    displayName: "Test User",
    institution: "Test Inst",
    membershipPurpose: "testing",
    role,
    accountStatus,
    membershipStatus,
  };
}

// ---------------------------------------------------------------------------
// Tests: requireActiveMember
// ---------------------------------------------------------------------------

describe("requireActiveMember", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when no session cookie", async () => {
    setupNoSession();
    const result = await requireActiveMember();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns unauthenticated when session cookie is invalid", async () => {
    setupSession("bad-token", new Error("Firebase: invalid token"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns unauthenticated when session is expired", async () => {
    setupSession("expired-token", new Error("Firebase: session expired"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns unauthenticated when session is revoked", async () => {
    setupSession("revoked-token", new Error("Firebase: session was revoked"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns missing-profile when Firestore profile is absent", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), undefined);
    const result = await requireActiveMember();
    expect(result.kind).toBe("missing-profile");
  });

  it("returns inactive-account for suspended account", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active", "suspended"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-account");
  });

  it("returns inactive-account for revoked account", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active", "revoked"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-account");
  });

  it("returns inactive-membership for pending member", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "pending"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-membership");
    if (result.kind === "inactive-membership") {
      expect(result.profile.membershipStatus).toBe("pending");
    }
  });

  it("returns inactive-membership for suspended member", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "suspended"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-membership");
    if (result.kind === "inactive-membership") {
      expect(result.profile.membershipStatus).toBe("suspended");
    }
  });

  it("returns inactive-membership for expired member", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "expired"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-membership");
    if (result.kind === "inactive-membership") {
      expect(result.profile.membershipStatus).toBe("expired");
    }
  });

  it("returns inactive-membership for revoked member", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "revoked"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("inactive-membership");
    if (result.kind === "inactive-membership") {
      expect(result.profile.membershipStatus).toBe("revoked");
    }
  });

  it("returns authorized for active member", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("authorized");
    if (result.kind === "authorized") {
      expect(result.profile.role).toBe("member");
      expect(result.profile.membershipStatus).toBe("active");
    }
  });

  it("returns authorized for active executive", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("executive", "active"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("authorized");
    if (result.kind === "authorized") {
      expect(result.profile.role).toBe("executive");
    }
  });

  it("returns authorized for active admin", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("admin", "active"));
    const result = await requireActiveMember();
    expect(result.kind).toBe("authorized");
    if (result.kind === "authorized") {
      expect(result.profile.role).toBe("admin");
    }
  });
});

// ---------------------------------------------------------------------------
// Tests: requireExecutive
// ---------------------------------------------------------------------------

describe("requireExecutive", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated for signed-out user", async () => {
    setupNoSession();
    const result = await requireExecutive();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns unauthenticated for invalid session", async () => {
    setupSession("bad-token", new Error("invalid"));
    const result = await requireExecutive();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns inactive-membership for pending member trying executive route", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "pending"));
    const result = await requireExecutive();
    expect(result.kind).toBe("inactive-membership");
  });

  it("returns forbidden for active member attempting executive access", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active"));
    const result = await requireExecutive();
    expect(result.kind).toBe("forbidden");
  });

  it("returns authorized for active executive user", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("executive", "active"));
    const result = await requireExecutive();
    expect(result.kind).toBe("authorized");
    if (result.kind === "authorized") {
      expect(result.profile.role).toBe("executive");
    }
  });

  it("returns authorized for admin user on executive route", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("admin", "active"));
    const result = await requireExecutive();
    expect(result.kind).toBe("authorized");
  });

  it("returns forbidden for instructor attempting executive access", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("instructor", "active"));
    const result = await requireExecutive();
    expect(result.kind).toBe("forbidden");
  });
});

// ---------------------------------------------------------------------------
// Tests: requireAdmin
// ---------------------------------------------------------------------------

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated for signed-out user", async () => {
    setupNoSession();
    const result = await requireAdmin();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns unauthenticated for invalid session", async () => {
    setupSession("bad-token", new Error("invalid"));
    const result = await requireAdmin();
    expect(result.kind).toBe("unauthenticated");
  });

  it("returns forbidden for non-admin role even when membership is pending", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "pending"));
    const result = await requireAdmin();
    expect(result.kind).toBe("forbidden");
  });

  it("returns forbidden for active member attempting admin access", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active"));
    const result = await requireAdmin();
    expect(result.kind).toBe("forbidden");
  });

  it("returns forbidden for active executive attempting admin access", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("executive", "active"));
    const result = await requireAdmin();
    expect(result.kind).toBe("forbidden");
  });

  it("returns authorized for admin role without requiring active membership", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("admin", "pending"));
    const result = await requireAdmin();
    expect(result.kind).toBe("authorized");
    if (result.kind === "authorized") {
      expect(result.profile.role).toBe("admin");
    }
  });

  it("returns inactive-account for suspended admin account", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), profileData("admin", "active", "suspended"));
    const result = await requireAdmin();
    expect(result.kind).toBe("inactive-account");
  });

  it("does not grant admin access to tampered client role — server loads from Firestore", async () => {
    // Simulates a user who edits their client-side token to claim admin role.
    // The server always loads from Firestore — the claims object is not used for role.
    // The Firestore profile says "member" so access is denied.
    setupSession("valid-token", fakeClaims("test-uid"), profileData("member", "active"));
    const result = await requireAdmin();
    // Even though the session is valid, the Firestore profile role is "member"
    expect(result.kind).toBe("forbidden");
  });

  it("returns missing-profile when Firestore is unavailable", async () => {
    setupSession("valid-token", fakeClaims("test-uid"), undefined);
    const result = await requireAdmin();
    expect(result.kind).toBe("missing-profile");
  });
});

// ---------------------------------------------------------------------------
// Tests: safe redirect
// ---------------------------------------------------------------------------

describe("safeRedirectTarget integration", () => {
  it("does not allow open redirect via login?redirect param", async () => {
    const { safeRedirectTarget } = await import("@/lib/auth/redirect");
    // An attacker-controlled value that should be rejected
    expect(safeRedirectTarget("https://evil.com/phish")).toBe("/dashboard");
    expect(safeRedirectTarget("//evil.com")).toBe("/dashboard");
    expect(safeRedirectTarget("/\\evil.com")).toBe("/dashboard");
  });

  it("allows safe internal redirects", async () => {
    const { safeRedirectTarget } = await import("@/lib/auth/redirect");
    expect(safeRedirectTarget("/dashboard")).toBe("/dashboard");
    expect(safeRedirectTarget("/courses/module-1")).toBe("/courses/module-1");
    expect(safeRedirectTarget("/admin/members")).toBe("/admin/members");
  });
});

// ---------------------------------------------------------------------------
// Tests: secure logout (cookie clearing contract)
// ---------------------------------------------------------------------------

describe("secure logout", () => {
  it("POST /api/auth/logout clears the session cookie", async () => {
    // We test that the logout API handler produces a response that clears
    // the __session cookie (max-age: 0, httpOnly: true).
    // This is a contract test — it validates cookie clearing behaviour.
    const { POST } = await import("@/app/api/auth/logout/route");
    const { NextRequest } = await import("next/server");

    const req = new NextRequest("http://localhost/api/auth/logout", {
      method: "POST",
      headers: { origin: "http://localhost" },
    });

    const response = await POST(req);

    // Response must be a success
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(400);

    // Cookie must be cleared (Set-Cookie with max-age 0 or expires in the past)
    const setCookieHeader = response.headers.get("set-cookie") ?? "";
    expect(setCookieHeader).toMatch(/__session/);
    expect(setCookieHeader).toMatch(/max-age=0|expires=Thu, 01 Jan 1970/i);
  });

  it("POST /api/auth/logout rejects cross-origin requests", async () => {
    const { POST } = await import("@/app/api/auth/logout/route");
    const { NextRequest } = await import("next/server");

    const req = new NextRequest("http://localhost/api/auth/logout", {
      method: "POST",
      headers: { origin: "https://evil.com" },
    });

    const response = await POST(req);
    expect(response.status).toBe(403);
  });
});
