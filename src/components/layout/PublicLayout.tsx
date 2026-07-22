import Link from "next/link";
import { InstitutionalFooter } from "./InstitutionalFooter";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f6ee] text-[#0f172a]">
      <header className="border-b border-[#d8d0bc] bg-[#001f3f] text-[#f5f1de]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Kelly Legacy Institute</p>
            <h1 className="mt-1 text-xl font-semibold">Member Portal</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="rounded-full px-3 py-2 transition hover:bg-white/10">Overview</Link>
            <Link href="/login" className="rounded-full px-3 py-2 transition hover:bg-white/10">Login</Link>
            <Link href="/register" className="rounded-full px-3 py-2 transition hover:bg-white/10">Register</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</main>
      <InstitutionalFooter />
    </div>
  );
}
