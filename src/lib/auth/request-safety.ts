import type { NextRequest } from "next/server";

export function isTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  return origin === request.nextUrl.origin;
}
