import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

vi.mock("firebase-admin/firestore", () => ({
  FieldValue: { serverTimestamp: vi.fn(() => "server-time") },
}));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminDb: vi.fn(),
}));

import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import {
  consumeSessionRateLimit,
  SESSION_RATE_LIMIT_MAX,
  SESSION_RATE_LIMIT_WINDOW_MS,
} from "@/lib/auth/session-rate-limit";

const mockGetDb = vi.mocked(getFirebaseAdminDb);

describe("session rate limiter", () => {
  let record: Record<string, unknown> | undefined;

  beforeEach(() => {
    record = undefined;
    mockGetDb.mockReturnValue({
      collection: vi.fn().mockReturnValue({
        doc: vi.fn().mockReturnValue({ id: "client-key" }),
      }),
      runTransaction: vi.fn(async (callback) =>
        callback({
          get: vi.fn().mockImplementation(async () => ({
            data: () => record,
          })),
          set: vi.fn().mockImplementation((_ref, data) => {
            record = data;
          }),
          update: vi.fn().mockImplementation((_ref, data) => {
            record = { ...record, ...data };
          }),
        })
      ),
    } as never);
  });

  it("throttles a shared client and resets after the window", async () => {
    const request = new NextRequest("http://localhost/api/auth/session", {
      headers: {
        "x-forwarded-for": "192.0.2.10",
        "user-agent": "test-browser",
      },
    });
    const startedAt = 1_000_000;

    for (let attempt = 0; attempt < SESSION_RATE_LIMIT_MAX; attempt += 1) {
      await expect(consumeSessionRateLimit(request, startedAt)).resolves.toEqual({
        allowed: true,
      });
    }

    await expect(consumeSessionRateLimit(request, startedAt)).resolves.toEqual({
      allowed: false,
      retryAfterSeconds: SESSION_RATE_LIMIT_WINDOW_MS / 1000,
    });
    await expect(
      consumeSessionRateLimit(request, startedAt + SESSION_RATE_LIMIT_WINDOW_MS)
    ).resolves.toEqual({ allowed: true });
  });
});
