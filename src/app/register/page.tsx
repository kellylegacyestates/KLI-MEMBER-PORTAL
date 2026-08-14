"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/firebase/registerUser";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [membershipPurpose, setMembershipPurpose] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!displayName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const result = await registerUser({
      email,
      password,
      displayName,
      institution,
      membershipPurpose,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Member Registration</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#001f3f]">Create your institutional account</h1>
        <p className="mt-4 text-base leading-8 text-[#243449]">
          Register with your institutional details to access the member library, publications, and professional resources.
        </p>

        {success ? (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
            <p className="font-semibold">Account created successfully.</p>
            <p className="mt-1">
              Your account has been created and is pending membership review. Access will become available after approval.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <Link href="/login" className="font-semibold text-[#001f3f] underline underline-offset-2">
                Sign in
              </Link>
              <Link href="/" className="font-semibold text-[#001f3f] underline underline-offset-2">
                Return to public home
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Full name</label>
              <input
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="Jordan Ellis"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Institution</label>
              <input
                type="text"
                autoComplete="organization"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="Kelly Legacy Institute"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Email address</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="member@organization.org"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Confirm password</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Membership purpose</label>
              <textarea
                value={membershipPurpose}
                onChange={(e) => setMembershipPurpose(e.target.value)}
                disabled={isSubmitting}
                className="min-h-28 w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]"
                placeholder="Describe your research or professional interest in the portal."
              />
            </div>

            {error && (
              <div className="md:col-span-2">
                <p className="rounded-2xl border border-[#f2c7b8] bg-[#fff2ee] px-3 py-2 text-sm text-[#7a2b1d]">
                  {error}
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account\u2026" : "Create account"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-sm text-[#243449]">
          Already have access?{" "}
          <Link href="/login" className="font-semibold text-[#001f3f]">
            Sign in
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}
