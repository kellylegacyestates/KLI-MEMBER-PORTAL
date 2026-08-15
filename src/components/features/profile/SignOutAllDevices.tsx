"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function SignOutAllDevices() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function revokeSessions() {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout-all", {
        method: "POST",
        cache: "no-store",
      });
      if (!response.ok) {
        setError("We could not sign out all devices. Please try again.");
        return;
      }
      if (auth) {
        try {
          await signOut(auth);
        } catch {
          // Server-side revocation succeeded; continue to the sign-in screen.
        }
      }
      router.replace("/login?signedOut=all");
    } catch {
      setError("We could not sign out all devices. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 sm:p-8">
      <h3 className="text-base font-semibold text-[#001f3f]">Active sessions</h3>
      <p className="mt-2 text-sm text-[#243449]">
        Sign out this account everywhere if a device is lost or account access may be at risk.
      </p>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-5 rounded-full border border-[#7a2b1d] px-5 py-2 text-sm font-semibold text-[#7a2b1d]"
        >
          Sign out all devices
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-[#7a2b1d]">
            You will need to sign in again on every device.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={revokeSessions}
              disabled={submitting}
              className="rounded-full bg-[#7a2b1d] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Signing out…" : "Confirm sign out"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={submitting}
              className="rounded-full border border-[#d8d0bc] px-5 py-2 text-sm font-semibold text-[#243449]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
