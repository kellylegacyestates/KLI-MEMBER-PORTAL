const SESSION_COOKIE_NAME = "__session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionDurationMs() {
  return SESSION_MAX_AGE_MS;
}

export function getSessionCookieOptions(maxAge: number = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: isProduction(),
    priority: "high" as const,
  };
}
