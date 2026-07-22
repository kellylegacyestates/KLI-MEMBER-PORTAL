import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "A sample bookmarks workspace for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const bookmarks = [
  { title: "Resource index", description: "A curated list of institutional materials aligned to current research priorities.", meta: "Pinned" },
  { title: "Standing ledger", description: "A bookmark to the latest recorded obligations and review notes.", meta: "Saved" },
  { title: "Curriculum module", description: "A bookmark to the next recommended module for member study.", meta: "Pinned" },
];

export default function BookmarksPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Bookmarks" title="Saved resources" description="A personal index of important materials and reference points for repeated use." />
        <div className="grid gap-6 md:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <InfoCard key={bookmark.title} title={bookmark.title} description={bookmark.description} meta={bookmark.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
