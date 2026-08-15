"use client";

import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import {
  adminNavigation,
  executiveNavigation,
  isNavigationItemActive,
  primaryNavigation,
} from "./navigation";
import type { UserRole } from "@/lib/firebase/userProfile";

type SidebarNavProps = {
  role?: UserRole | null;
};

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const isExecutive = role === "executive" || role === "admin";
  const isAdmin = role === "admin";

  return (
    <nav aria-label="Portal navigation" className="h-full border-r border-[#d8d0bc] bg-[#f8f6ee] p-4 lg:p-6">
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-white/80 p-4 shadow-sm">
        <div className="rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] p-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
            Portal Navigation
          </p>
          <p className="mt-2 text-sm leading-7 text-[#243449]">Institutional materials and member services.</p>
        </div>
        <div className="mt-4 space-y-2">
          {primaryNavigation.map((group) => {
            const groupIsActive = group.items.some((item) => isNavigationItemActive(pathname, item));
            return (
              <details key={group.label} open={groupIsActive || group.label === "Home"} className="group rounded-xl">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-xl px-3 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-[#526276] hover:bg-[#f5f1de] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
                  {group.label}
                  <span aria-hidden="true" className="text-base transition group-open:rotate-90">›</span>
                </summary>
                <ul className="mt-1 space-y-1 border-l border-[#d8d0bc] pl-2">
                  {group.items.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </ul>
              </details>
            );
          })}
        </div>

        {/* Executive section — rendered only for executive and admin profiles. */}
        {isExecutive && (
          <div className="mt-6 rounded-[1.25rem] border border-[#d8d0bc] bg-[#001f3f]/5 p-4">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#001f3f]">
              Executive
            </p>
            <ul className="mt-3 space-y-1">
              {executiveNavigation.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        )}

        {/* Administrator section — rendered only for confirmed admin profiles. */}
        {isAdmin && (
          <div className="mt-6 rounded-[1.25rem] border border-[#d8d0bc] bg-[#001f3f] p-4 text-[#f5f1de]">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              Administrator
            </p>
            <ul className="mt-3 space-y-1">
              {adminNavigation.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} inverse />
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
