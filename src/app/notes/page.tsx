import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { notesEntries } from "@/lib/institutionalContent";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "My Notes",
  description: "The notes workspace for Kelly Legacy Institute members to capture observations and study points.",
};

export default async function NotesPage() {
  return (
    <MemberRouteGuard pathname="/notes">
          <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="My Notes"
            title="Member notes"
            description="A dedicated workspace for annotations, observations, and reference points tied to member learning."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {notesEntries.map((note) => (
              <InfoCard key={note.title} title={note.title} description={note.description} meta={note.meta} />
            ))}
          </div>
        </div>
      </AppShell>
        </MemberRouteGuard>
  );
}
