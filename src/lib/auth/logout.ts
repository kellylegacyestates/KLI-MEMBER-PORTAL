import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

async function clearServerSessionCookie() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    cache: "no-store",
  });

  return response.ok;
}

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
    serverLogoutFailed = !(await clearServerSessionCookie());

    if (serverLogoutFailed) {
      serverLogoutFailed = !(await clearServerSessionCookie());
    }
  } catch {
    serverLogoutFailed = true;
  }

  if (clientLogoutFailed || serverLogoutFailed) {
    throw new Error("Logout could not be completed.");
  }
}
