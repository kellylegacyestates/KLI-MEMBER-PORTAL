"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getContextualNavigation,
  getNavigationLabel,
} from "./navigation";

export function PortalBreadcrumbs() {
  const pathname = usePathname();
  const currentLabel = getNavigationLabel(pathname);

  if (pathname === "/dashboard" || !currentLabel) return null;

  const section = pathname.startsWith("/admin")
    ? { label: "Admin Overview", href: "/admin" }
    : pathname.startsWith("/executive")
      ? { label: "Executive Overview", href: "/executive" }
      : { label: "Dashboard", href: "/dashboard" };

  if (pathname === section.href) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5 overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-2 text-sm text-[#526276]">
        <li>
          <Link
            href={section.href}
            className="inline-flex min-h-11 items-center font-semibold text-[#001f3f] underline-offset-4 hover:underline"
          >
            {section.label}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">{currentLabel}</li>
      </ol>
    </nav>
  );
}

export function PortalContextualNavigation() {
  const pathname = usePathname();
  const navigation = getContextualNavigation(pathname);

  if (!navigation || pathname === navigation.overview.href) return null;

  return (
    <nav
      aria-label="Continue browsing"
      className="mt-10 border-t border-[#d8d0bc] pt-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={navigation.overview.href}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[#526276] hover:text-[#001f3f]"
        >
          ← {navigation.overview.label}
        </Link>
        <div className="flex flex-wrap gap-3">
          {navigation.previous ? (
            <Link
              href={navigation.previous.href}
              className="inline-flex min-h-11 items-center rounded-full border border-[#d8d0bc] px-4 py-2 text-sm font-semibold text-[#001f3f] transition hover:bg-[#f5f1de]"
            >
              ← {navigation.previous.label}
            </Link>
          ) : null}
          {navigation.next ? (
            <Link
              href={navigation.next.href}
              className="inline-flex min-h-11 items-center rounded-full bg-[#001f3f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002f5f]"
            >
              {navigation.next.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
