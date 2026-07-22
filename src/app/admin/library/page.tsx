import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Library Manager",
  description: "A sample library manager view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { title: "Institutional Records Manual", category: "Archives", status: "Available" },
  { title: "Standing and Review Practice", category: "Research", status: "Review" },
  { title: "Governance Reference", category: "Policy", status: "Available" },
];

export default function AdminLibraryPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Library Manager" description="Manage library records, access status, and reference availability." />
        <DataTable title="Library inventory" columns={[{ key: "title", header: "Title" }, { key: "category", header: "Category" }, { key: "status", header: "Status" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
