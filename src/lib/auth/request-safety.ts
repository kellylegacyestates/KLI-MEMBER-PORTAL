import type { NextRequest } from "next/server";

const TRUSTED_PRODUCTION_ORIGINS = new Set([
  "https://access.kellylegacyestates.com",
  "https://kli-member-portal--legacy-ai-production.us-central1.hosted.app",
]);

function firstHeaderValue(value: string): string {
  return value.split(",", 1)[0].trim();
}

function forwardedOrigin(headers: Headers): string | null | undefined {
  const forwarded = headers.get("forwarded");
  if (!forwarded) {
    return undefined;
  }

  const parameters = new Map(
    firstHeaderValue(forwarded)
      .split(";")
      .map((part) => part.trim().split("=", 2))
      .filter((part): part is [string, string] => part.length === 2)
      .map(([name, value]) => [
        name.toLowerCase(),
        value.replace(/^"|"$/g, ""),
      ])
  );

  return originFromProxyValues(parameters.get("proto"), parameters.get("host"));
}

function xForwardedOrigin(headers: Headers): string | null | undefined {
  const host = headers.get("x-forwarded-host");
  const proto = headers.get("x-forwarded-proto");

  if (!host && !proto) {
    return undefined;
  }

  return originFromProxyValues(
    proto ? firstHeaderValue(proto) : undefined,
    host ? firstHeaderValue(host) : undefined
  );
}

function originFromProxyValues(
  proto: string | undefined,
  host: string | undefined
): string | null {
  if (!proto || !host || !["http", "https"].includes(proto.toLowerCase())) {
    return null;
  }

  try {
    const url = new URL(`${proto.toLowerCase()}://${host}`);
    return url.pathname === "/" && !url.username && !url.password
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

export function isTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  if (
    origin === request.nextUrl.origin &&
    (process.env.NODE_ENV !== "production" ||
      TRUSTED_PRODUCTION_ORIGINS.has(origin))
  ) {
    return true;
  }

  if (!TRUSTED_PRODUCTION_ORIGINS.has(origin)) {
    return false;
  }

  const proxyOrigins = [
    forwardedOrigin(request.headers),
    xForwardedOrigin(request.headers),
  ].filter((value): value is string | null => value !== undefined);

  return (
    proxyOrigins.length > 0 &&
    proxyOrigins.every(
      (proxyOrigin) => proxyOrigin !== null && proxyOrigin === origin
    )
  );
}
