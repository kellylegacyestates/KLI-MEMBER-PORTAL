import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataTable } from "@/components/ui/DataTable";

const rows = [
  { item: "Curriculum reading", due: "12 Jul", status: "In progress", note: "Assigned for review" },
  { item: "Annual briefing", due: "18 Jul", status: "Pending", note: "Awaiting confirmation" },
  { item: "Access verification", due: "24 Jul", status: "Completed", note: "Recorded" },
];

export default function StandingLedgerPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Standing Ledger" title="Member obligations" description="A formal record of current assignments, confirmations, and follow-up items." />
        <DataTable title="Ledger entries" columns={[{ key: "item", header: "Item" }, { key: "due", header: "Due" }, { key: "status", header: "Status" }, { key: "note", header: "Note" }]} rows={rows} />
      </div>
    </AppShell>
  );
}
