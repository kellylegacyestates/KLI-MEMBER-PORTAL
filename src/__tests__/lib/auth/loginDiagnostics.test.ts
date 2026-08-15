import { describe, expect, it, vi } from "vitest";
import {
  getCredentialAuthenticationMessage,
  getSafeErrorCode,
  reportLoginFailure,
  type LoginFailureStage,
} from "@/lib/auth/loginDiagnostics";

describe("login diagnostics", () => {
  it.each([
    ["auth/invalid-credential", "could not verify"],
    ["auth/user-not-found", "could not verify"],
    ["auth/wrong-password", "could not verify"],
    ["auth/invalid-email", "valid email"],
    ["auth/user-disabled", "disabled"],
    ["auth/too-many-requests", "Too many"],
    ["auth/network-request-failed", "network issue"],
    ["auth/operation-not-allowed", "not enabled"],
  ])("maps %s to a useful message", (code, expectedText) => {
    expect(getCredentialAuthenticationMessage({ code })).toContain(
      expectedText
    );
  });

  it("extracts only bounded Firebase-style error codes", () => {
    expect(getSafeErrorCode({ code: "auth/invalid-credential" })).toBe(
      "auth/invalid-credential"
    );
    expect(getSafeErrorCode({ code: "a secret value" })).toBeNull();
    expect(getSafeErrorCode(new Error("failure"))).toBeNull();
  });

  it.each<LoginFailureStage>([
    "firebase-client-initialization",
    "firebase-credential-authentication",
    "id-token-acquisition",
    "session-creation",
    "post-auth-redirect",
  ])("logs only a stage and safe code for %s failures", (stage) => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = {
      code: "auth/network-request-failed",
      password: "must-not-be-logged",
    };

    reportLoginFailure(stage, error);

    expect(consoleError).toHaveBeenCalledWith(`[login:${stage}]`, {
      code: "auth/network-request-failed",
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      error.password
    );
    consoleError.mockRestore();
  });
});
