import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { title: "Federal oversight update", status: "Published", audience: "Members" },
  { title: "Research agenda briefing", status: "Scheduled", audience: "Admins" },
  { title: "Member communications", status: "Draft", audience: "Members" },
];

export default function AdminBriefingsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Weekly Briefings Manager" description="Coordinate briefing publication, audience targeting, and release calendar." />
        <DataTable title="Briefing queue" columns={[{ key: "title", header: "Title" }, { key: "status", header: "Status" }, { key: "audience", header: "Audience" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
