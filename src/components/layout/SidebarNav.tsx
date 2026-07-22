import Link from "next/link";
import { adminNavigation, primaryNavigation } from "./navigation";

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center rounded-2xl px-3 py-2 text-sm font-medium text-[#243449] transition hover:bg-[#f5f1de] hover:text-[#001f3f]"
      >
        {label}
      </Link>
    </li>
  );
}

export function SidebarNav() {
  return (
    <nav className="h-full border-r border-[#d8d0bc] bg-[#f8f6ee] p-4 lg:p-6">
      <div className="rounded-3xl border border-[#d8d0bc] bg-white/80 p-4 shadow-sm">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">
          Portal Navigation
        </p>
        <ul className="mt-4 space-y-1">
          {primaryNavigation.map((item) => (
            <NavItem key={item.label} label={item.label} href={item.href} />
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-[#d8d0bc] bg-[#001f3f] p-4 text-[#f5f1de]">
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
