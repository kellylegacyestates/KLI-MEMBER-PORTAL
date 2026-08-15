import { describe, expect, it, vi } from "vitest";
import {
  parseAuthorizedEmails,
  provisionAdmins,
} from "../../../scripts/provision-admins.mjs";

type Profile = Record<string, unknown>;

function createDependencies(
  users: Record<string, { uid: string; email: string; emailVerified: boolean }>,
  profiles: Record<string, Profile> = {}
) {
  const writes: Array<{ operation: string; path: string; data?: Profile; options?: unknown }> = [];
  let auditIndex = 0;
  const doc = (collection: string, id?: string) => {
    const resolvedId = id ?? `audit-${++auditIndex}`;
    return {
      path: `${collection}/${resolvedId}`,
      get: vi.fn(async () => ({
        data: () => profiles[resolvedId],
      })),
    };
  };
  const batch = {
    set: vi.fn((ref, data, options) => {
      writes.push({ operation: "set", path: ref.path, data, options });
    }),
    create: vi.fn((ref, data) => {
      writes.push({ operation: "create", path: ref.path, data });
    }),
    commit: vi.fn(async () => undefined),
  };
  const db = {
    collection: vi.fn((name: string) => ({
      doc: (id?: string) => doc(name, id),
    })),
    batch: vi.fn(() => batch),
  };
  const auth = {
    getUserByEmail: vi.fn(async (email: string) => {
      const user = users[email];
      if (!user) {
        throw Object.assign(new Error("not found"), { code: "auth/user-not-found" });
      }
      return user;
    }),
  };

  return { auth, db, batch, writes };
}

describe("admin provisioning", () => {
  it("parses, normalizes, and deduplicates the server-only email list", () => {
    expect(parseAuthorizedEmails(" Admin@One.test,admin@one.test, two@test.dev ")).toEqual([
      "admin@one.test",
      "two@test.dev",
    ]);
  });

  it("preflights every identity and refuses all writes when one is missing", async () => {
    const dependencies = createDependencies({
      "first@test.dev": {
        uid: "uid-1",
        email: "first@test.dev",
        emailVerified: true,
      },
    });

    await expect(
      provisionAdmins({
        ...dependencies,
        emails: ["first@test.dev", "missing@test.dev"],
        dryRun: false,
      })
    ).rejects.toThrow("does not exist");
    expect(dependencies.db.batch).not.toHaveBeenCalled();
  });

  it("refuses all writes when an identity is unverified", async () => {
    const dependencies = createDependencies({
      "unverified@test.dev": {
        uid: "uid-1",
        email: "unverified@test.dev",
        emailVerified: false,
      },
    });

    await expect(
      provisionAdmins({
        ...dependencies,
        emails: ["unverified@test.dev"],
        dryRun: false,
      })
    ).rejects.toThrow("not email-verified");
    expect(dependencies.db.batch).not.toHaveBeenCalled();
  });

  it("reports changes without writing in dry-run mode", async () => {
    const dependencies = createDependencies({
      "admin@test.dev": {
        uid: "immutable-uid",
        email: "admin@test.dev",
        emailVerified: true,
      },
    });
    const logger = { info: vi.fn() } as unknown as Console;

    const result = await provisionAdmins({
      ...dependencies,
      emails: ["admin@test.dev"],
      dryRun: true,
      logger,
    });

    expect(result).toEqual({ checked: 1, changed: 1, dryRun: true });
    expect(dependencies.db.batch).not.toHaveBeenCalled();
  });

  it("merges authorization by UID and appends an audit event", async () => {
    const dependencies = createDependencies(
      {
        "admin@test.dev": {
          uid: "immutable-uid",
          email: "admin@test.dev",
          emailVerified: true,
        },
      },
      {
        "immutable-uid": {
          displayName: "Preserved Name",
          role: "member",
          accountStatus: "active",
          membershipStatus: "pending",
        },
      }
    );

    const result = await provisionAdmins({
      ...dependencies,
      emails: ["admin@test.dev"],
      dryRun: false,
      serverTimestamp: (() => "server-time") as never,
    });

    expect(result.changed).toBe(1);
    expect(dependencies.writes).toEqual([
      {
        operation: "set",
        path: "users/immutable-uid",
        data: {
          email: "admin@test.dev",
          role: "admin",
          accountStatus: "active",
          membershipStatus: "active",
          updatedAt: "server-time",
        },
        options: { merge: true },
      },
      {
        operation: "create",
        path: "auditEvents/audit-1",
        data: expect.objectContaining({
          action: "user.authorization.update",
          targetUid: "immutable-uid",
          outcome: "success",
          timestamp: "server-time",
        }),
      },
    ]);
    expect(dependencies.batch.commit).toHaveBeenCalledOnce();
  });

  it("is idempotent when authorization already matches", async () => {
    const dependencies = createDependencies(
      {
        "admin@test.dev": {
          uid: "immutable-uid",
          email: "admin@test.dev",
          emailVerified: true,
        },
      },
      {
        "immutable-uid": {
          email: "admin@test.dev",
          role: "admin",
          accountStatus: "active",
          membershipStatus: "active",
          displayName: "Preserved Name",
        },
      }
    );

    const result = await provisionAdmins({
      ...dependencies,
      emails: ["admin@test.dev"],
      dryRun: false,
    });

    expect(result.changed).toBe(0);
    expect(dependencies.db.batch).not.toHaveBeenCalled();
    expect(dependencies.writes).toEqual([]);
  });
});
