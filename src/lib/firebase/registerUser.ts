import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { createUserProfile } from "@/lib/firebase/userProfile";

export type RegistrationParams = {
  email: string;
  password: string;
  displayName: string;
  institution: string;
  membershipPurpose: string;
};

export type RegistrationResult =
  | { success: true }
  | { success: false; message: string };

const getFriendlyRegistrationError = (code: string): string => {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with that email address.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Please choose a stronger password (at least 6 characters).";
    case "auth/network-request-failed":
      return "A network issue prevented registration. Please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Registration could not be completed. Please try again.";
  }
};

/**
 * Create a Firebase Auth account and the corresponding Firestore profile.
 *
 * SECURITY: the profile's role is ALWAYS forced to "member" inside
 * createUserProfile — this function does not expose a role parameter.
 * No browser call path can assign admin or instructor.
 */
export async function registerUser(
  params: RegistrationParams
): Promise<RegistrationResult> {
  if (!auth) {
    return {
      success: false,
      message:
        "Authentication is not configured. Contact your administrator.",
    };
  }

  if (!db) {
    return {
      success: false,
      message:
        "The member profile service is not available. Contact your administrator.",
    };
  }

  try {
    // 1. Create the Firebase Auth account.
    const credential = await createUserWithEmailAndPassword(
      auth,
      params.email.trim(),
      params.password
    );

    const { uid } = credential.user;

    // 2. Set the Auth display name (best-effort; does not block profile write).
    try {
      await updateProfile(credential.user, {
        displayName: params.displayName.trim(),
      });
    } catch {
      // Non-fatal; the Firestore profile is the authoritative display name.
    }

    // 3. Write the Firestore profile.  Role is forced to "member" inside
    //    createUserProfile and cannot be overridden here.
    try {
      await createUserProfile(db, {
        uid,
        email: params.email.trim(),
        displayName: params.displayName.trim(),
        institution: params.institution.trim(),
        membershipPurpose: params.membershipPurpose.trim(),
      });
    } catch {
      // Firestore profile creation failed.  Roll back the Auth account so the
      // user can retry with the same email address rather than receiving
      // "email already in use" on every subsequent attempt.
      try {
        await credential.user.delete();
      } catch {
        // Best-effort rollback; if delete also fails, the user will need admin
        // assistance, but we must not surface internal details to the browser.
      }
      return {
        success: false,
        message: "Registration could not be completed. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    const code =
      err instanceof Error && "code" in err ? String(err.code) : "";
    return { success: false, message: getFriendlyRegistrationError(code) };
  }
}
