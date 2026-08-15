"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchIndex } from "@/lib/institutionalContent";

type GlobalSearchProps = {
  className?: string;
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim();
  const hasSpecialCharacters = /[!@#$%^&*()_+]/.test(normalizedQuery);

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return searchIndex.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return haystack.includes(normalizedQuery.toLowerCase());
    });
  }, [normalizedQuery]);

  const showResults = normalizedQuery.length > 0 && !hasSpecialCharacters && results.length > 0;
  const showEmpty = normalizedQuery.length > 0 && !hasSpecialCharacters && results.length === 0;
  const showError = normalizedQuery.length > 0 && hasSpecialCharacters;

  return (
    <div className={`relative ${className ?? ""}`}>
      <label className="sr-only" htmlFor="global-search">
        Search institutional resources
      </label>
      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setQuery("");
        }}
        placeholder="Search lessons, research, briefings..."
        className="w-full rounded-full border border-[#d8d0bc] bg-white/95 px-4 py-2.5 text-sm text-[#001f3f] shadow-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
      />

      {normalizedQuery ? (
        <div
          role="region"
          aria-live="polite"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[1.25rem] border border-[#d8d0bc] bg-white shadow-[0_20px_60px_rgba(0,31,63,0.08)]"
        >
          {showError ? (
            <div className="px-4 py-4 text-sm text-[#243449]">
              Remove special characters and try a broader term.
            </div>
          ) : null}

          {showEmpty ? (
            <div className="px-4 py-4 text-sm text-[#243449]">
              No results found for “{normalizedQuery}”. Try a broader topic such as trust administration or governance.
            </div>
          ) : null}

          {showResults ? (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((item) => (
                <li key={`${item.type}-${item.title}`}>
                  <Link
                    href={item.href}
                    onClick={() => setQuery("")}
                    className="flex flex-col gap-1 border-t border-[#f0ebde] px-4 py-3 text-left transition hover:bg-[#f8f6ee]"
                  >
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
                      {item.type}
                    </span>
                    <span className="text-sm font-semibold text-[#001f3f]">{item.title}</span>
                    <span className="text-sm text-[#243449]">{item.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
