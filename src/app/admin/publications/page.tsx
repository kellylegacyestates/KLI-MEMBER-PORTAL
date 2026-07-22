import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Publication Manager",
  description: "A publication manager view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { title: "Quarterly Review", status: "Published", audience: "Members" },
  { title: "Research Bulletin", status: "Draft", audience: "Administrators" },
  { title: "Member Memo", status: "Scheduled", audience: "Members" },
];

export default function AdminPublicationsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Publication Manager" description="Coordinate publication readiness, release timing, and distribution settings." />
        <DataTable title="Publication queue" columns={[{ key: "title", header: "Title" }, { key: "status", header: "Status" }, { key: "audience", header: "Audience" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
