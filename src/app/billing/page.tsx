import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

export default function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Billing" title="Account and invoices" description="A structured account overview intended for member billing and institutional stewardship." />
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoCard title="Current plan" description="Institutional member access with full research and curriculum privileges." meta="Active" />
          <InfoCard title="Invoice history" description="Recent charges and billing records available for review in the member portal." meta="Updated" />
        </div>
      </div>
    </AppShell>
  );
}
