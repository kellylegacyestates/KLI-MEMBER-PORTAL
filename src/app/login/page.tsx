import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Kelly Legacy Institute member portal demonstration.",
};

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de] shadow-sm sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Institutional Access</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Sign in to the member portal</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#e8e2cf]">
            Review curriculum, publications, and institutional resources through a secure and carefully structured member experience.
          </p>
        </section>

        <section className="rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-[#001f3f]">Member sign-in</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Email address</label>
              <input className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="member@kellylegacyinstitute.org" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#001f3f]">Password</label>
              <input type="password" className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="••••••••" />
            </div>
            <button className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57]">Sign in</button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#243449]">
            <Link href="/forgot-password" className="font-medium text-[#001f3f]">Forgot password?</Link>
            <Link href="/register" className="font-medium text-[#001f3f]">Create account</Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
