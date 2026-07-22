import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { title: "Fiduciary Foundations", category: "Governance", status: "Available", updated: "3 days ago" },
  { title: "Standing and Review Practice", category: "Research", status: "Scheduled", updated: "5 days ago" },
  { title: "Institutional Records Manual", category: "Archives", status: "Available", updated: "1 week ago" },
];

export default function ResearchLibraryPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Research Library" title="Reference collection" description="A research library experience designed for institutional scholarship and professional reference." />
        <DataTable title="Collections" columns={[{ key: "title", header: "Title" }, { key: "category", header: "Category" }, { key: "status", header: "Status" }, { key: "updated", header: "Updated" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
