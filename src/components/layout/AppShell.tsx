"use client";

import { useState } from "react";
import { InstitutionalFooter } from "./InstitutionalFooter";
import { InstitutionalHeader } from "./InstitutionalHeader";
import { MobileNav } from "./MobileNav";
import { SidebarNav } from "./SidebarNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f6ee] text-[#0f172a]">
      <InstitutionalHeader onMenuToggle={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <SidebarNav />
        </aside>

        <main className="flex-1 bg-[#f8f6ee] p-4 sm:p-6 lg:p-8">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-white/80 p-6 shadow-[0_20px_80px_rgba(0,31,63,0.06)] sm:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>

      <InstitutionalFooter />
    </div>
  );
}
