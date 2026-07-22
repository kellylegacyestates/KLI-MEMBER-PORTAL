"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation, primaryNavigation } from "./navigation";

function NavItem({ label, href }: { label: string; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${isActive ? "bg-[#f5f1de] text-[#001f3f]" : "text-[#243449] hover:bg-[#f5f1de] hover:text-[#001f3f]"}`}
      >
        {label}
      </Link>
    </li>
  );
}

export function SidebarNav() {
  return (
    <nav className="h-full border-r border-[#d8d0bc] bg-[#f8f6ee] p-4 lg:p-6">
      <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-white/80 p-4 shadow-sm">
        <div className="rounded-2xl border border-[#d8d0bc] bg-[#f8f6ee] p-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
            Portal Navigation
          </p>
          <p className="mt-2 text-sm leading-7 text-[#243449]">Institutional materials and member services.</p>
        </div>
        <ul className="mt-4 space-y-1">
          {primaryNavigation.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} />
          ))}
        </ul>

        <div className="mt-6 rounded-[1.25rem] border border-[#d8d0bc] bg-[#001f3f] p-4 text-[#f5f1de]">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
            Administrator
          </p>
          <ul className="mt-3 space-y-1">
            {adminNavigation.map((item) => (
              <NavItem key={item.label} label={item.label} href={item.href} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
