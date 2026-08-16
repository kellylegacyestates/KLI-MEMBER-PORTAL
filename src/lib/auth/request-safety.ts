import type { NextRequest } from "next/server";

const TRUSTED_PRODUCTION_ORIGINS = new Set([
  "https://access.kellylegacyestates.com",
  "https://kli-member-portal--legacy-ai-production.us-central1.hosted.app",
]);

function headerValues(value: string): string[] {
  return value.split(",").map((part) => part.trim());
}

function forwardedOrigins(headers: Headers): string[] | null | undefined {
  const forwarded = headers.get("forwarded");
  if (!forwarded) {
    return undefined;
  }

  const origins = headerValues(forwarded).map((element) => {
    const parameters = new Map(
      element
      .split(";")
      .map((part) => part.trim().split("=", 2))
      .filter((part): part is [string, string] => part.length === 2)
      .map(([name, value]) => [
        name.toLowerCase(),
        value.replace(/^"|"$/g, ""),
      ])
    );
    const proto = parameters.get("proto");
    const host = parameters.get("host");

    return proto && host ? originFromProxyValues(proto, host) : undefined;
  });

  return origins.includes(null)
    ? null
    : origins.filter((origin): origin is string => origin !== undefined);
}

function xForwardedOrigins(headers: Headers): string[] | null | undefined {
  const host = headers.get("x-forwarded-host");
  const proto = headers.get("x-forwarded-proto");

  if (!host && !proto) {
    return undefined;
  }

  if (!host || !proto) {
    return null;
  }

  const hosts = headerValues(host);
  const protos = headerValues(proto);
  const count = Math.max(hosts.length, protos.length);

  if (
    hosts.length !== protos.length &&
    hosts.length !== 1 &&
    protos.length !== 1
  ) {
    return null;
  }

  const origins = Array.from({ length: count }, (_, index) =>
    originFromProxyValues(
      protos.length === 1 ? protos[0] : protos[index],
      hosts.length === 1 ? hosts[0] : hosts[index]
    )
  );

  return origins.includes(null)
    ? null
    : origins.filter((origin): origin is string => origin !== null);
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

function isTrustedDevelopmentOrigin(origin: string): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const url = new URL(origin);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function isTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  if (
    origin === request.nextUrl.origin &&
    (isTrustedDevelopmentOrigin(origin) ||
      TRUSTED_PRODUCTION_ORIGINS.has(origin))
  ) {
    return true;
  }

  if (!TRUSTED_PRODUCTION_ORIGINS.has(origin)) {
    return false;
  }

  const forwarded = forwardedOrigins(request.headers);
  const xForwarded = xForwardedOrigins(request.headers);

  if (forwarded === null || xForwarded === null) {
    return false;
  }

  const proxyOriginFamilies = [forwarded, xForwarded].filter(
    (value): value is string[] => value !== undefined && value.length > 0
  );

  return (
    proxyOriginFamilies.length > 0 &&
    proxyOriginFamilies.every((proxyOrigins) => proxyOrigins.includes(origin))
  );
}
