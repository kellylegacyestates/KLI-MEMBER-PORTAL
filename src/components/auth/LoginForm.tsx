"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  auth,
  firebaseClientInitializationErrorCode,
} from "@/lib/firebase/client";
import {
  getCredentialAuthenticationMessage,
  reportLoginFailure,
} from "@/lib/auth/loginDiagnostics";
import { safeRedirectTarget } from "@/lib/auth/redirect";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const sessionExpired = searchParams.get("reason") === "session-expired";
  const signedOutEverywhere = searchParams.get("signedOut") === "all";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError(
        firebaseClientInitializationErrorCode
          ? "Firebase client initialization failed. Reload the page or contact support."
          : "Firebase authentication is not configured. Add the required NEXT_PUBLIC_FIREBASE_* values to continue."
      );
      return;
    }
    const firebaseAuth = auth;

    const sanitizedEmail = email.trim();
    if (!sanitizedEmail || !password.trim()) {
      setError("Please enter both your email address and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const clearClientAuthentication = async () => {
      try {
        await signOut(firebaseAuth);
      } catch {
        // Best-effort cleanup; server authorization still requires a session cookie.
      }
    };

    try {
      let credential;
      try {
        credential = await signInWithEmailAndPassword(
          firebaseAuth,
          sanitizedEmail,
          password
        );
      } catch (credentialError) {
        reportLoginFailure(
          "firebase-credential-authentication",
          credentialError
        );
        setError(getCredentialAuthenticationMessage(credentialError));
        return;
      }

      let idToken: string;
      try {
        idToken = await credential.user.getIdToken();
      } catch (tokenError) {
        await clearClientAuthentication();
        reportLoginFailure("id-token-acquisition", tokenError);
        setError(
          "Firebase sign-in succeeded, but ID-token acquisition failed. Try again."
        );
        return;
      }

      let sessionResponse: Response;
      try {
        sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ idToken }),
        });
      } catch (sessionError) {
        await clearClientAuthentication();
        reportLoginFailure("session-creation", sessionError);
        setError(
          "Firebase sign-in succeeded, but the secure session request could not reach the server. Try again."
        );
        return;
      }

      if (!sessionResponse.ok) {
        await clearClientAuthentication();

        if (sessionResponse.status === 429) {
          const retryAfter = Number(sessionResponse.headers.get("retry-after"));
          setError(
            Number.isFinite(retryAfter) && retryAfter > 0
              ? `Too many sign-in attempts. Please wait ${retryAfter} seconds and try again.`
              : "Too many sign-in attempts. Please wait a moment and try again."
          );
        } else if (sessionResponse.status === 403) {
          let errorCode = "";
          try {
            const body = (await sessionResponse.json()) as { error?: unknown };
            errorCode = typeof body.error === "string" ? body.error : "";
          } catch {
            // Use the stage-specific session error when the response is not JSON.
          }
          setError(
            errorCode === "email_verification_required"
              ? "Firebase sign-in succeeded, but email verification is required before a session can be created."
              : "Firebase sign-in succeeded, but the server rejected secure session creation."
          );
        } else {
          setError(
            `Firebase sign-in succeeded, but secure session creation failed (HTTP ${sessionResponse.status}).`
          );
        }
        reportLoginFailure("session-creation");
        return;
      }

      const safeRedirect = safeRedirectTarget(redirectTarget);
      try {
        router.replace(safeRedirect);
      } catch (redirectError) {
        reportLoginFailure("post-auth-redirect", redirectError);
        setError(
          "Your secure session was created, but the member portal could not be opened. Refresh the page to continue."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
      <h2 className="text-2xl font-semibold text-[#001f3f]">Member sign-in</h2>
      {sessionExpired ? (
        <p role="status" className="mt-4 rounded-2xl border border-[#d4af37] bg-[#fffbed] px-4 py-3 text-sm text-[#243449]">
          Your session expired or was revoked. Sign in again to continue.
        </p>
      ) : null}
      {signedOutEverywhere ? (
        <p role="status" className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          You have been signed out on all devices.
        </p>
      ) : null}
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
