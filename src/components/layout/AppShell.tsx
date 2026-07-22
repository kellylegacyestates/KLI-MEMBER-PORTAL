"use client";

import { useEffect, useState } from "react";
import { InstitutionalFooter } from "./InstitutionalFooter";
import { InstitutionalHeader } from "./InstitutionalHeader";
import { MobileNav } from "./MobileNav";
import { SidebarNav } from "./SidebarNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-[#f8f6ee] text-[#0f172a]">
      <InstitutionalHeader onMenuToggle={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <SidebarNav />
        </aside>

        <main className="flex-1 bg-[#f8f6ee] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-white/90 p-5 shadow-[0_18px_70px_rgba(0,31,63,0.05)] sm:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>

      <InstitutionalFooter />
    </div>
  );
}
