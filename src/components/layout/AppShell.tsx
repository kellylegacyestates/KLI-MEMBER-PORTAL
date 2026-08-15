"use client";

import { useState } from "react";
import { InstitutionalFooter } from "./InstitutionalFooter";
import { InstitutionalHeader } from "./InstitutionalHeader";
import { MobileNav } from "./MobileNav";
import { SidebarNav } from "./SidebarNav";
import type { MembershipStatus, UserRole } from "@/lib/firebase/userProfile";

export type PortalProfileData = {
  displayName: string;
  email: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
};

type AppShellProps = {
  children: React.ReactNode;
  profileData?: PortalProfileData | null;
};

export function AppShell({ children, profileData }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f6ee] text-[#0f172a]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-[#d4af37] px-4 py-3 font-semibold text-[#001f3f] transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <InstitutionalHeader
        onMenuToggle={() => setMobileNavOpen(true)}
        isMenuOpen={mobileNavOpen}
        profileData={profileData}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        profileData={profileData}
      />

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <SidebarNav role={profileData?.role} />
        </aside>

        <main id="main-content" tabIndex={-1} className="flex-1 bg-[#f8f6ee] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-white/90 p-5 shadow-[0_18px_70px_rgba(0,31,63,0.05)] sm:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>

      <InstitutionalFooter />
    </div>
  );
}
