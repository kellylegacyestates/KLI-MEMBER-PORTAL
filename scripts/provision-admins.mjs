import { pathToFileURL } from "node:url";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const EMAIL_ENV_NAME = "ADMIN_PROVISIONING_EMAILS";
const AUDIT_ACTION = "user.authorization.update";
const AUDIT_REASON = "Approved administrative account provisioning";
const ACTOR_UID = "system:admin-provisioning";

export function parseAuthorizedEmails(value) {
  const emails = (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const uniqueEmails = [...new Set(emails)];

  if (uniqueEmails.length === 0) {
    throw new Error(`${EMAIL_ENV_NAME} must contain at least one email address.`);
  }

  if (uniqueEmails.some((email) => !email.includes("@"))) {
    throw new Error(`${EMAIL_ENV_NAME} contains an invalid email address.`);
  }

  return uniqueEmails;
}

function authorizationState(profile) {
  return {
    email: typeof profile?.email === "string" ? profile.email : null,
    role: typeof profile?.role === "string" ? profile.role : null,
    accountStatus:
      typeof profile?.accountStatus === "string" ? profile.accountStatus : null,
    membershipStatus:
      typeof profile?.membershipStatus === "string"
        ? profile.membershipStatus
        : null,
  };
}

function desiredAuthorizationState(user) {
  return {
    email: user.email,
    role: "admin",
    accountStatus: "active",
    membershipStatus: "active",
  };
}

function statesMatch(current, desired) {
  return Object.entries(desired).every(([key, value]) => current[key] === value);
}

async function resolveVerifiedUsers(auth, emails) {
  return Promise.all(
    emails.map(async (email) => {
      let user;

      try {
        user = await auth.getUserByEmail(email);
      } catch (error) {
        if (error?.code === "auth/user-not-found") {
          throw new Error(`Authorized Firebase Auth user does not exist: ${email}`);
        }
        throw new Error(`Could not verify the Firebase Auth user for ${email}.`);
      }

      if (!user.email || user.email.toLowerCase() !== email) {
        throw new Error(`Firebase Auth returned an unexpected identity for ${email}.`);
      }

      if (!user.emailVerified) {
        throw new Error(`Authorized Firebase Auth user is not email-verified: ${email}`);
      }

      return { uid: user.uid, email };
    })
  );
}

export async function provisionAdmins({
  auth,
  db,
  emails,
  dryRun,
  logger = console,
  serverTimestamp = FieldValue.serverTimestamp,
}) {
  const users = await resolveVerifiedUsers(auth, emails);
  const profiles = await Promise.all(
    users.map((user) => db.collection("users").doc(user.uid).get())
  );
  const changes = users.flatMap((user, index) => {
    const current = authorizationState(profiles[index].data());
    const desired = desiredAuthorizationState(user);
    return statesMatch(current, desired) ? [] : [{ user, current, desired }];
  });

  if (dryRun) {
    logger.info(
      `Dry run complete: ${changes.length} of ${users.length} account(s) require authorization changes.`
    );
    return { checked: users.length, changed: changes.length, dryRun: true };
  }

  if (changes.length === 0) {
    logger.info(`Provisioning complete: all ${users.length} account(s) are already authorized.`);
    return { checked: users.length, changed: 0, dryRun: false };
  }

  const batch = db.batch();
  for (const { user, current, desired } of changes) {
    const profileRef = db.collection("users").doc(user.uid);
    const auditRef = db.collection("auditEvents").doc();
    const timestamp = serverTimestamp();

    batch.set(
      profileRef,
      {
        ...desired,
        updatedAt: timestamp,
      },
      { merge: true }
    );
    batch.create(auditRef, {
      action: AUDIT_ACTION,
      actorUid: ACTOR_UID,
      targetUid: user.uid,
      oldValue: current,
      newValue: desired,
      reason: AUDIT_REASON,
      outcome: "success",
      timestamp,
    });
  }

  await batch.commit();
  logger.info(
    `Provisioning complete: ${changes.length} of ${users.length} account(s) authorized.`
  );
  return { checked: users.length, changed: changes.length, dryRun: false };
}

function initializeAdmin() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
    process.env.GCLOUD_PROJECT?.trim();

  if (!projectId) {
    throw new Error(
      "Set FIREBASE_ADMIN_PROJECT_ID (or a Google Cloud project environment variable)."
    );
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: applicationDefault(),
      projectId,
    });

  return { auth: getAuth(app), db: getFirestore(app) };
}

async function main() {
  const unknownArguments = process.argv.slice(2).filter((arg) => arg !== "--dry-run");
  if (unknownArguments.length > 0) {
    throw new Error(`Unsupported argument: ${unknownArguments[0]}`);
  }

  const emails = parseAuthorizedEmails(process.env[EMAIL_ENV_NAME]);
  const { auth, db } = initializeAdmin();
  await provisionAdmins({
    auth,
    db,
    emails,
    dryRun: process.argv.includes("--dry-run"),
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Admin provisioning failed.");
    process.exitCode = 1;
  });
}
