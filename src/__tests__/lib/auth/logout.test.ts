import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  auth: { currentUser: { uid: "admin-1" } },
}));

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { logoutUser } from "@/lib/auth/logout";

const mockSignOut = vi.mocked(signOut);

describe("logoutUser", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears the server session before clearing the Firebase client session", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetch);

    await logoutUser();

    expect(fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
    });
    expect(mockSignOut).toHaveBeenCalledWith(auth);
    expect(fetch.mock.invocationCallOrder[0]).toBeLessThan(
      mockSignOut.mock.invocationCallOrder[0]
    );
  });

  it("fails closed and preserves the client session when server logout fails", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetch);

    await expect(logoutUser()).rejects.toThrow("Logout could not be completed.");
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("finishes server logout when Firebase client cleanup reports an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    mockSignOut.mockRejectedValue(new Error("client persistence unavailable"));

    await expect(logoutUser()).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith({
      reason: "LOGOUT_CLIENT_SIGNOUT_FAILED",
    });
  });
});
