import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Members",
  description: "An administrative members view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { name: "Jordan Ellis", institution: "Kelly Legacy Institute", status: "Active", access: "Full" },
  { name: "Alicia Grant", institution: "Harvard Law Library", status: "Pending", access: "Review" },
  { name: "Mina Patel", institution: "National Archives", status: "Active", access: "Full" },
];

export default function AdminMembersPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Members" description="Manage institutional accounts and review access for member groups." />
        <DataTable title="Member accounts" columns={[{ key: "name", header: "Name" }, { key: "institution", header: "Institution" }, { key: "status", header: "Status" }, { key: "access", header: "Access" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
