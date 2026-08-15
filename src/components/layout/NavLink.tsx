"use client";

import Link from "next/link";
import {
  isNavigationItemActive,
  type NavigationItem,
} from "./navigation";

type NavLinkProps = {
  item: NavigationItem;
  pathname: string;
  inverse?: boolean;
  onClick?: () => void;
};

export function NavLink({ item, pathname, inverse = false, onClick }: NavLinkProps) {
  const isActive = isNavigationItemActive(pathname, item);

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={`flex min-h-11 items-center rounded-2xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
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
