import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Recover Access",
  description: "Recover access to the Kelly Legacy Institute member portal demonstration.",
};

export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Account Recovery</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#001f3f]">Recover your institutional access</h1>
        <p className="mt-4 text-base leading-8 text-[#243449]">
          Enter the email address associated with your member account and we will send the next set of access instructions.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Email address</label>
            <input className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="member@kellylegacyinstitute.org" />
          </div>
          <button className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57]">Send recovery instructions</button>
        </form>

        <p className="mt-6 text-sm text-[#243449]">
          Return to <Link href="/login" className="font-semibold text-[#001f3f]">sign in</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
