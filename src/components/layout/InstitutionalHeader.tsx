"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth/logout";
import { GlobalSearch } from "./SearchBar";
import type { PortalProfileData } from "./AppShell";

type InstitutionalHeaderProps = {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  profileData?: PortalProfileData | null;
};

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  instructor: "Instructor",
  executive: "Executive",
  admin: "Administrator",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  expired: "Expired",
  revoked: "Revoked",
};

export function InstitutionalHeader({ onMenuToggle, isMenuOpen, profileData }: InstitutionalHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <header className="border-b border-[#d8d0bc] bg-[#001f3f] text-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_minmax(18rem,1fr)_auto] lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37] bg-[#d4af37]/10 text-sm font-semibold tracking-[0.2em] text-[#f5f1de]">
              KLI
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">
                Kelly Legacy Institute
              </p>
              <h1 className="text-lg font-semibold text-[#f5f1de]">Member Portal</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-[#f5f1de] lg:hidden"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span>Menu</span>
            <span aria-hidden="true" className="text-base">☰</span>
          </button>
        </div>

        <div className="min-w-0">
          <GlobalSearch />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {profileData ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#f5f1de] leading-tight">
                  {profileData.displayName || profileData.email}
                </p>
                <p className="text-[0.65rem] text-[#d4af37] leading-tight">
                  {ROLE_LABELS[profileData.role] ?? profileData.role}
                  {" · "}
                  {STATUS_LABELS[profileData.membershipStatus] ?? profileData.membershipStatus}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-[#f5f1de] transition hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-[#f5f1de]">
                Institutional Access
              </div>
              <div className="rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#001f3f]">
                Member Services
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
