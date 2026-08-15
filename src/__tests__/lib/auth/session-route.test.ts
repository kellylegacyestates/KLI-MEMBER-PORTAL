import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/session-rate-limit", () => ({
  consumeSessionRateLimit: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

import { consumeSessionRateLimit } from "@/lib/auth/session-rate-limit";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { POST } from "@/app/api/auth/session/route";

const mockRateLimit = vi.mocked(consumeSessionRateLimit);
const mockGetAuth = vi.mocked(getFirebaseAdminAuth);

function request() {
  return new NextRequest("http://localhost/api/auth/session", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost",
    },
    body: JSON.stringify({ idToken: "valid-token" }),
  });
}

describe("POST /api/auth/session rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockResolvedValue({ allowed: true });
    mockGetAuth.mockReturnValue({
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: "member-1",
        auth_time: Math.floor(Date.now() / 1000),
        email_verified: true,
      }),
      createSessionCookie: vi.fn().mockResolvedValue("session-cookie"),
    } as never);
  });

  it("allows session establishment below the limit", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("__session=");
  });

  it("returns 429 and Retry-After when throttled", async () => {
    mockRateLimit.mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 42,
    });

    const response = await POST(request());

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("42");
    expect(mockGetAuth).not.toHaveBeenCalled();
  });

  it("allows a later request after the limiter recovers", async () => {
    mockRateLimit
      .mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 1 })
      .mockResolvedValueOnce({ allowed: true });

    expect((await POST(request())).status).toBe(429);
    expect((await POST(request())).status).toBe(200);
  });

  it("refuses to create a session for an unverified email", async () => {
    const createSessionCookie = vi.fn();
    mockGetAuth.mockReturnValue({
      verifyIdToken: vi.fn().mockResolvedValue({
        uid: "member-1",
        auth_time: Math.floor(Date.now() / 1000),
        email_verified: false,
      }),
      createSessionCookie,
    } as never);

    const response = await POST(request());

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "email_verification_required",
    });
    expect(createSessionCookie).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toContain("__session=;");
  });
});
