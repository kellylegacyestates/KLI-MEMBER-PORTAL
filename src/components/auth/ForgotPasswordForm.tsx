"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      setError("Firebase authentication is not configured. Add the required NEXT_PUBLIC_FIREBASE_* values to continue.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setMessage("If an account exists for that email address, recovery instructions have been sent.");
    } catch {
      // Keep this intentionally generic so the UI does not reveal
      // whether an email address is registered.
      setError("We could not process the recovery request. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#001f3f]">
          Email address
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="member@kellylegacyinstitute.org"
          className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
        />
      </div>

      {message && (
        <p role="status" className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send recovery instructions"}
      </button>

      <p className="text-sm text-[#243449]">
        Return to{" "}
        <Link href="/login" className="font-medium text-[#001f3f]">
          sign in
        </Link>
      </p>
    </form>
  );
}
