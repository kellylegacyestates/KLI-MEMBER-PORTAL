import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

export const metadata: Metadata = {
  title: "Billing",
  description: "The billing overview for Kelly Legacy Institute members.",
};

export default function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Billing"
          title="Account and invoices"
          description="A structured account overview intended for member billing and institutional stewardship."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoCard title="Current plan" description="Institutional member access with full research, curriculum, and publication privileges." meta="Active">
            <div className="mt-4 space-y-3 text-sm text-[#243449]">
              <p><span className="font-semibold text-[#001f3f]">Plan:</span> Fellow Member</p>
              <p><span className="font-semibold text-[#001f3f]">Renewal:</span> September 30, 2026</p>
              <p><span className="font-semibold text-[#001f3f]">Includes:</span> Briefings, library access, and annual publications</p>
            </div>
          </InfoCard>
          <InfoCard title="Invoice history" description="Recent charges and billing records available for review in the member portal." meta="Updated">
            <div className="mt-4 space-y-3 text-sm text-[#243449]">
              <p><span className="font-semibold text-[#001f3f]">June 2026:</span> Annual membership renewal</p>
              <p><span className="font-semibold text-[#001f3f]">March 2026:</span> Research library access update</p>
              <p><span className="font-semibold text-[#001f3f]">January 2026:</span> Curriculum materials distribution</p>
            </div>
          </InfoCard>
        </div>
      </div>
    </AppShell>
  );
}
