export type LoginFailureStage =
  | "firebase-client-initialization"
  | "firebase-credential-authentication"
  | "id-token-acquisition"
  | "session-creation"
  | "post-auth-redirect";

const credentialErrorMessages: Record<string, string> = {
  "auth/invalid-credential":
    "Firebase could not verify those sign-in details. Check your email and password.",
  "auth/user-not-found":
    "Firebase could not verify those sign-in details. Check your email and password.",
  "auth/wrong-password":
    "Firebase could not verify those sign-in details. Check your email and password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-disabled": "This member account has been disabled.",
  "auth/too-many-requests":
    "Too many login attempts were made. Wait a moment and try again.",
  "auth/network-request-failed":
    "A network issue prevented Firebase from completing sign-in. Try again.",
  "auth/operation-not-allowed":
    "Email and password sign-in is not enabled for this portal. Contact support.",
};

export function getSafeErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }

  const code = (error as { code?: unknown }).code;
  if (
    typeof code !== "string" ||
    code.length > 100 ||
    !/^[a-z][a-z0-9-]*\/[a-z0-9-]+$/i.test(code)
  ) {
    return null;
  }

  return code;
}

export function getCredentialAuthenticationMessage(error: unknown): string {
  const code = getSafeErrorCode(error);
  return (
    (code && credentialErrorMessages[code]) ||
    "Firebase credential authentication failed. Verify your details and try again."
  );
}

export function reportLoginFailure(
  stage: LoginFailureStage,
  error?: unknown
): void {
  console.error(`[login:${stage}]`, {
    code: getSafeErrorCode(error) ?? "unknown",
  });
}
