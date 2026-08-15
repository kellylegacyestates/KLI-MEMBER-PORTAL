import "server-only";

import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import type { NextRequest } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

const COLLECTION = "_authSessionRateLimits";
export const SESSION_RATE_LIMIT_MAX = 10;
export const SESSION_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

type RateLimitRecord = {
  count?: unknown;
  windowStartedAt?: unknown;
};

export type SessionRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

function clientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent")?.slice(0, 256) || "unknown";
  return createHash("sha256").update(`${address}\n${userAgent}`).digest("hex");
}

export async function consumeSessionRateLimit(
  request: NextRequest,
  now = Date.now()
): Promise<SessionRateLimitResult> {
  const db = getFirebaseAdminDb();
  const ref = db.collection(COLLECTION).doc(clientKey(request));

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = (snapshot.data() ?? {}) as RateLimitRecord;
    const storedStart =
      typeof data.windowStartedAt === "number" ? data.windowStartedAt : 0;
    const storedCount = typeof data.count === "number" ? data.count : 0;
    const windowExpired =
      !storedStart || now - storedStart >= SESSION_RATE_LIMIT_WINDOW_MS;

    if (windowExpired) {
      transaction.set(ref, {
        count: 1,
        windowStartedAt: now,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return { allowed: true };
    }

    if (storedCount >= SESSION_RATE_LIMIT_MAX) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((storedStart + SESSION_RATE_LIMIT_WINDOW_MS - now) / 1000)
        ),
      };
    }

    transaction.set(
      ref,
      {
        count: storedCount + 1,
        windowStartedAt: storedStart,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { allowed: true };
  });
}
