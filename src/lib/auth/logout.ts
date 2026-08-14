import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function logoutUser() {
  let clientLogoutFailed = false;

  if (auth) {
    try {
      await signOut(auth);
    } catch {
      clientLogoutFailed = true;
    }
  }

  let serverLogoutFailed = false;

  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      serverLogoutFailed = true;
    }
  } catch {
    serverLogoutFailed = true;
  }

  if (clientLogoutFailed || serverLogoutFailed) {
    throw new Error("Logout could not be completed.");
  }
}
