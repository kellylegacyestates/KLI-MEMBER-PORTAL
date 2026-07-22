import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Notes",
  description: "A sample notes workspace for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const notes = [
  { title: "Administrative Procedure", description: "Prepare evidence summaries and record key observations from the latest discussion.", meta: "Draft" },
  { title: "Research Reading", description: "Capture questions for follow-up in the next seminar group meeting.", meta: "Saved" },
  { title: "Member Briefing", description: "Note critical action items for the next monthly briefing session.", meta: "Pinned" },
];

export default function NotesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Notes" title="Member notes" description="A dedicated workspace for annotations, observations, and reference points tied to member learning." />
        <div className="grid gap-6 md:grid-cols-3">
          {notes.map((note) => (
            <InfoCard key={note.title} title={note.title} description={note.description} meta={note.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
