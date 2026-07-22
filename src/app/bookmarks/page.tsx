import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { bookmarkEntries } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "The saved resources workspace for Kelly Legacy Institute members.",
};

export default function BookmarksPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Bookmarks"
          title="Saved resources"
          description="A personal index of important materials and reference points for repeated use."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bookmarkEntries.map((bookmark) => (
            <InfoCard key={bookmark.title} title={bookmark.title} description={bookmark.description} meta={bookmark.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
