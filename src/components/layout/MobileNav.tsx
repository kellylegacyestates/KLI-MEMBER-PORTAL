"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "@/lib/auth/logout";
import {
  adminNavigation,
  executiveNavigation,
  isNavigationItemActive,
  primaryNavigation,
  type NavigationItem,
} from "./navigation";
import type { PortalProfileData } from "./AppShell";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  profileData?: PortalProfileData | null;
};

const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  instructor: "Instructor",
  executive: "Executive",
  admin: "Administrator",
};

function MobileNavItem({
  item,
  pathname,
  onClose,
  inverse = false,
}: {
  item: NavigationItem;
  pathname: string;
  onClose: () => void;
  inverse?: boolean;
}) {
  const isActive = isNavigationItemActive(pathname, item);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClose}
        aria-current={isActive ? "page" : undefined}
        className={`flex min-h-11 items-center rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
          inverse
            ? isActive
              ? "bg-white/15 text-white"
              : "text-[#f5f1de] hover:bg-white/10"
            : isActive
              ? "bg-[#f5f1de] text-[#001f3f]"
              : "text-[#243449] hover:bg-[#f5f1de] hover:text-[#001f3f]"
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

export function MobileNav({ isOpen, onClose, profileData }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [signOutFailed, setSignOutFailed] = useState(false);
  const role = profileData?.role;
  const isExecutive = role === "executive" || role === "admin";
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setSignOutFailed(false);
    try {
      await logoutUser();
      onClose();
      router.push("/login");
    } catch {
      setSignOutFailed(true);
      closeButtonRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-[#001f3f]/85 lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        className="flex h-dvh w-[88%] max-w-sm flex-col bg-[#f8f6ee] shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#d8d0bc] px-5 py-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Navigation</p>
            <h2 id="mobile-navigation-title" className="text-lg font-semibold text-[#001f3f]">Member Access</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-[#001f3f] transition hover:bg-[#f5f1de] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            aria-label="Close navigation"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {profileData ? (
          <div className="shrink-0 border-b border-[#d8d0bc] bg-white/70 px-5 py-4">
            <p className="break-words text-sm font-semibold text-[#001f3f]">
              {profileData.displayName || profileData.email}
            </p>
            <p className="mt-1 text-xs text-[#526276]">
              {ROLE_LABELS[profileData.role] ?? profileData.role} · {profileData.membershipStatus}
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/profile"
                onClick={onClose}
                className="inline-flex min-h-11 items-center rounded-full border border-[#d8d0bc] px-4 py-2 text-sm font-semibold text-[#001f3f]"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-11 rounded-full bg-[#001f3f] px-4 py-2 text-sm font-semibold text-white"
              >
                Sign out
              </button>
            </div>
            {signOutFailed ? (
              <p role="alert" className="mt-3 text-sm text-[#7a2b1d]">
                Sign out failed. Please try again.
              </p>
            ) : null}
          </div>
        ) : null}

        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-5" aria-label="Mobile portal navigation">
          <div className="space-y-3">
            {primaryNavigation.map((group) => {
              const groupIsActive = group.items.some((item) => isNavigationItemActive(pathname, item));
              return (
                <details key={group.label} open={groupIsActive || group.label === "Home"} className="group rounded-2xl border border-[#d8d0bc] bg-white/70">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl px-4 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-[#526276] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
                    {group.label}
                    <span aria-hidden="true" className="text-lg transition group-open:rotate-90">›</span>
                  </summary>
                  <ul className="space-y-1 border-t border-[#e7e1d3] p-2">
                    {group.items.map((item) => (
                      <MobileNavItem key={item.href} item={item} pathname={pathname} onClose={onClose} />
                    ))}
                  </ul>
                </details>
              );
            })}

            {isExecutive ? (
              <details open={pathname.startsWith("/executive")} className="group rounded-2xl border border-[#d8d0bc] bg-[#001f3f]/5">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl px-4 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-[#001f3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
                  Executive
                  <span aria-hidden="true" className="text-lg transition group-open:rotate-90">›</span>
                </summary>
                <ul className="space-y-1 border-t border-[#d8d0bc] p-2">
                  {executiveNavigation.map((item) => (
                    <MobileNavItem key={item.href} item={item} pathname={pathname} onClose={onClose} />
                  ))}
                </ul>
              </details>
            ) : null}

            {isAdmin ? (
              <details open={pathname.startsWith("/admin")} className="group rounded-2xl bg-[#001f3f] text-[#f5f1de]">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl px-4 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-[#d4af37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
                  Administration
                  <span aria-hidden="true" className="text-lg transition group-open:rotate-90">›</span>
                </summary>
                <ul className="space-y-1 border-t border-white/10 p-2">
                  {adminNavigation.map((item) => (
                    <MobileNavItem key={item.href} item={item} pathname={pathname} onClose={onClose} inverse />
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  );
}
