import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

import { POST } from "@/app/api/auth/logout/route";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const mockGetAuth = vi.mocked(getFirebaseAdminAuth);
const productionOrigin = "https://access.kellylegacyestates.com";

function productionRequest(origin = productionOrigin, cookie = "valid-session") {
  return new NextRequest("http://internal-cloud-run:8080/api/auth/logout", {
    method: "POST",
    headers: {
      origin,
      forwarded:
        "for=192.0.2.1;proto=http;host=internal-cloud-run:8080, for=192.0.2.2;proto=https;host=access.kellylegacyestates.com",
      "x-forwarded-host":
        "access.kellylegacyestates.com, internal-cloud-run:8080",
      "x-forwarded-proto": "https, http",
      ...(cookie ? { cookie: `__session=${cookie}` } : {}),
    },
  });
}

describe("POST /api/auth/logout", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revokes a production App Hosting session and deletes its cookie", async () => {
    const verifySessionCookie = vi.fn().mockResolvedValue({ uid: "admin-1" });
    const revokeRefreshTokens = vi.fn().mockResolvedValue(undefined);
    mockGetAuth.mockReturnValue({
      verifySessionCookie,
      revokeRefreshTokens,
    } as never);

    const response = await POST(productionRequest());

    expect(response.status).toBe(200);
    expect(verifySessionCookie).toHaveBeenCalledWith("valid-session", true);
    expect(revokeRefreshTokens).toHaveBeenCalledWith("admin-1");

    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("__session=;");
    expect(cookie).toMatch(/Path=\//i);
    expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/i);
    expect(cookie).toMatch(/Max-Age=0/i);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=lax/i);
    expect(cookie).not.toMatch(/Domain=/i);
  });

  it("leaves the session intact when server revocation fails", async () => {
    mockGetAuth.mockReturnValue({
      verifySessionCookie: vi.fn().mockResolvedValue({ uid: "admin-1" }),
      revokeRefreshTokens: vi.fn().mockRejectedValue(new Error("unavailable")),
    } as never);

    const response = await POST(productionRequest());

    expect(response.status).toBe(500);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(warn).toHaveBeenCalledWith({ reason: "LOGOUT_REVOKE_FAILED" });
  });

  it.each([
    ["hostile", "https://evil.example"],
    ["malformed", "not-an-origin"],
  ])("rejects a %s browser origin", async (_label, origin) => {
    const response = await POST(productionRequest(origin));

    expect(response.status).toBe(403);
    expect(mockGetAuth).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(warn).toHaveBeenCalledWith({ reason: "LOGOUT_REJECT_ORIGIN" });
  });
});
