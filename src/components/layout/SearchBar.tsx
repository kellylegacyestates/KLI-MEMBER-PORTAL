"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { searchIndex } from "@/lib/institutionalContent";

type GlobalSearchProps = {
  className?: string;
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      setHasError(/[!@#$%^&*()_+]/.test(query));
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return searchIndex.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  const showResults = query.trim().length > 0 && !isLoading && results.length > 0;
  const showEmpty = query.trim().length > 0 && !isLoading && results.length === 0 && !hasError;
  const showError = hasError;

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
        placeholder="Search lessons, research, briefings..."
        className="w-full rounded-full border border-[#d8d0bc] bg-white/95 px-4 py-2.5 text-sm text-[#001f3f] shadow-sm outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
      />

      {query.trim() ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[1.25rem] border border-[#d8d0bc] bg-white shadow-[0_20px_60px_rgba(0,31,63,0.08)]">
          {isLoading ? (
            <div className="px-4 py-4 text-sm text-[#243449]">Loading institutional results…</div>
          ) : null}

          {showError ? (
            <div className="px-4 py-4 text-sm text-[#243449]">
              Remove special characters and try a broader term.
            </div>
          ) : null}

          {showEmpty ? (
            <div className="px-4 py-4 text-sm text-[#243449]">
              No results found for “{query.trim()}”. Try a broader topic such as trust administration or governance.
            </div>
          ) : null}

          {showResults ? (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((item) => (
                <li key={`${item.type}-${item.title}`}>
                  <Link
                    href={item.href}
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
