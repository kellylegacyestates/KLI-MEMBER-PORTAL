"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation, primaryNavigation } from "./navigation";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-[#001f3f]/85 lg:hidden" onClick={onClose}>
      <div className="h-full w-[88%] max-w-sm bg-[#f8f6ee] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#d8d0bc] pb-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Navigation</p>
            <h2 className="text-lg font-semibold text-[#001f3f]">Member Access</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-lg text-[#001f3f] transition hover:bg-[#f5f1de] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6 overflow-y-auto pb-6">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              Member Tools
            </p>
            <ul className="mt-3 space-y-1">
              {primaryNavigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${isActive ? "bg-[#f5f1de] text-[#001f3f]" : "text-[#243449] hover:bg-[#f5f1de] hover:text-[#001f3f]"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#001f3f] p-4 text-[#f5f1de]">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
              Administrative
            </p>
            <ul className="mt-3 space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${isActive ? "bg-white/10 text-white" : "text-[#f5f1de] hover:bg-white/10"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
