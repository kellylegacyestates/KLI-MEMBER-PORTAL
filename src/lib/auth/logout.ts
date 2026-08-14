import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function logoutUser() {
  if (!auth) {
    throw new Error("Firebase authentication is not configured.");
  }

  await signOut(auth);
}
