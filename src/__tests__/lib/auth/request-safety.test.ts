import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { isTrustedOrigin } from "@/lib/auth/request-safety";

const customOrigin = "https://access.kellylegacyestates.com";
const canonicalOrigin =
  "https://kli-member-portal--legacy-ai-production.us-central1.hosted.app";

function request(origin?: string, headers: Record<string, string> = {}) {
  return new NextRequest("http://internal-cloud-run:8080/api/auth/session", {
    method: "POST",
    headers: {
      ...(origin ? { origin } : {}),
      ...headers,
    },
  });
}

describe("trusted request origins", () => {
  it("accepts the custom domain through trusted forwarding headers", () => {
    expect(
      isTrustedOrigin(
        request(customOrigin, {
          "x-forwarded-host": "access.kellylegacyestates.com",
          "x-forwarded-proto": "https",
        })
      )
    ).toBe(true);
  });

  it("accepts the canonical App Hosting backend through Forwarded", () => {
    expect(
      isTrustedOrigin(
        request(canonicalOrigin, {
          forwarded:
            "for=192.0.2.1;proto=https;host=kli-member-portal--legacy-ai-production.us-central1.hosted.app",
        })
      )
    ).toBe(true);
  });

  it("rejects a mismatched hostile origin", () => {
    expect(
      isTrustedOrigin(
        request("https://evil.example", {
          "x-forwarded-host": "access.kellylegacyestates.com",
          "x-forwarded-proto": "https",
        })
      )
    ).toBe(false);
  });

  it("rejects an unlisted same-origin host outside production", () => {
    expect(
      isTrustedOrigin(request("http://internal-cloud-run:8080"))
    ).toBe(false);
  });

  it("rejects a missing origin", () => {
    expect(
      isTrustedOrigin(
        request(undefined, {
          "x-forwarded-host": "access.kellylegacyestates.com",
          "x-forwarded-proto": "https",
        })
      )
    ).toBe(false);
  });

  it("rejects an untrusted forwarded host", () => {
    expect(
      isTrustedOrigin(
        request(customOrigin, {
          "x-forwarded-host": "evil.example",
          "x-forwarded-proto": "https",
        })
      )
    ).toBe(false);
  });

  it("rejects a forwarded protocol that does not match the origin", () => {
    expect(
      isTrustedOrigin(
        request(customOrigin, {
          "x-forwarded-host": "access.kellylegacyestates.com",
          "x-forwarded-proto": "http",
        })
      )
    ).toBe(false);
  });

  it("rejects conflicting proxy header families", () => {
    expect(
      isTrustedOrigin(
        request(customOrigin, {
          forwarded:
            "for=192.0.2.1;proto=https;host=access.kellylegacyestates.com",
          "x-forwarded-host": "evil.example",
          "x-forwarded-proto": "https",
        })
      )
    ).toBe(false);
  });
});
