import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8d0bc] bg-white p-8 shadow-sm sm:p-10">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Member Registration</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#001f3f]">Create your institutional account</h1>
        <p className="mt-4 text-base leading-8 text-[#243449]">
          Register with your institutional details to access the member library, publications, and professional resources.
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Full name</label>
            <input className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="Jordan Ellis" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Institution</label>
            <input className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="Kelly Legacy Institute" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Email address</label>
            <input className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="member@organization.org" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Password</label>
            <input type="password" className="w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="••••••••" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#001f3f]">Membership purpose</label>
            <textarea className="min-h-28 w-full rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] px-4 py-3 outline-none focus:border-[#d4af37]" placeholder="Describe your research or professional interest in the portal." />
          </div>
          <div className="md:col-span-2">
            <button className="w-full rounded-full bg-[#001f3f] px-5 py-3 text-sm font-semibold text-[#f5f1de] transition hover:bg-[#072b57]">Create account</button>
          </div>
        </form>

        <p className="mt-6 text-sm text-[#243449]">
          Already have access? <Link href="/login" className="font-semibold text-[#001f3f]">Sign in</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
