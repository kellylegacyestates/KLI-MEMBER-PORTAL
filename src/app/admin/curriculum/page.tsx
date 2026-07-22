import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Curriculum Manager",
  description: "A curriculum manager view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { module: "The Record", status: "Published", updated: "Today" },
  { module: "Standing and Jurisdiction", status: "Review", updated: "2 days ago" },
  { module: "Administrative Procedure", status: "Published", updated: "4 days ago" },
];

export default function AdminCurriculumPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Curriculum Manager" description="Oversee curriculum modules and publication readiness for the member experience." />
        <DataTable title="Curriculum inventory" columns={[{ key: "module", header: "Module" }, { key: "status", header: "Status" }, { key: "updated", header: "Updated" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
