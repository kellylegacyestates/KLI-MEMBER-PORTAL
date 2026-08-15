/**
 * Safe internal redirect helper.
 *
 * Returns `path` when it is a valid same-origin application path, or
 * `fallback` (default "/dashboard") when the value is absent, malformed, or
 * targets an external destination.
 *
 * Rejected inputs include:
 *  - anything that does not start with exactly one "/"
 *  - protocol-relative URLs  (//)
 *  - backslash-based equivalents (\\ or /\)
 *  - absolute URLs containing "://"
 *  - values that URL-parse to a different origin than the application
 */
export function safeRedirectTarget(
  path: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!path || typeof path !== "string") {
    return fallback;
  }

  // Must start with exactly one forward slash (no protocol-relative or absolute URLs).
  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  // Reject backslash-based bypasses (/\ or \).
  if (path.startsWith("/\\") || path.startsWith("\\")) {
    return fallback;
  }

  // Reject embedded scheme references (e.g. /path?url=http://).
  if (/[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(path)) {
    return fallback;
  }

  // Final origin-check: resolve against a dummy base and confirm the result
  // stays on the same (placeholder) origin.
  try {
    const resolved = new URL(path, "https://app.internal");
    if (resolved.origin !== "https://app.internal") {
      return fallback;
    }
  } catch {
    return fallback;
  }

  return path;
}
