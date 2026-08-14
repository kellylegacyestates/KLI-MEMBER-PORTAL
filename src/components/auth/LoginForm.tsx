"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const getFriendlyAuthError = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This member account has been disabled.";
    case "auth/user-not-found":
      return "We could not find an account with that email.";
    case "auth/wrong-password":
      return "The password you entered is incorrect.";
    case "auth/invalid-credential":
      return "The sign-in details are invalid. Please try again.";
    case "auth/too-many-requests":
      return "Too many login attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "A network issue interrupted the sign-in. Please try again.";
    default:
      return "We could not sign you in. Please verify your details and try again.";
  }
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError("Firebase authentication is not configured. Add the required NEXT_PUBLIC_FIREBASE_* values to continue.");
      return;
    }

    const sanitizedEmail = email.trim();
    if (!sanitizedEmail || !password.trim()) {
      setError("Please enter both your email address and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        sanitizedEmail,
        password
      );
      const idToken = await credential.user.getIdToken();
      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        try {
          await signOut(auth);
        } catch {
          // Best-effort cleanup; the user should not keep a client-only login.
        }

        setError("We could not complete your sign-in. Please try again.");
        return;
      }

      const safeRedirectTarget = redirectTarget.startsWith("/") ? redirectTarget : "/dashboard";
      router.replace(safeRedirectTarget);
    } catch (signInError) {
      if (!(signInError instanceof Error) || !("code" in signInError)) {
        setError("We could not complete your sign-in. Please try again.");
        return;
      }

      setError(getFriendlyAuthError(String(signInError.code)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
      <h2 className="text-2xl font-semibold text-[#001f3f]">Member sign-in</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#001f3f]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
            placeholder="member@kellylegacyinstitute.org"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#001f3f]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
            placeholder="••••••••"
            disabled={isSubmitting}
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-[#f2c7b8] bg-[#fff2ee] px-3 py-2 text-sm text-[#7a2b1d]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !email.trim() || !password.trim()}
          className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57] disabled:cursor-not-allowed disabled:bg-[#50657a]"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#243449]">
        <Link href="/forgot-password" className="font-medium text-[#001f3f]">
          Forgot password?
        </Link>
        <Link href="/register" className="font-medium text-[#001f3f]">
          Create account
        </Link>
      </div>
    </section>
  );
}
