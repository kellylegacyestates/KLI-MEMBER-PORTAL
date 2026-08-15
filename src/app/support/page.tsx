import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Support",
  description: "A support area for the Kelly Legacy Institute member portal.",
};

export default async function SupportPage() {
  return (
    <MemberRouteGuard pathname="/support">
      <PortalShell>
        <div className="space-y-8">
          <SectionHeader eyebrow="Support" title="Member support" description="Dedicated assistance for access, account guidance, technical support, and institutional requests." />
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard title="Account support" description="Guidance for sign-in, recovery, and member access concerns." meta="Priority" />
            <InfoCard title="Technical assistance" description="Support for platform access, document retrieval, and service questions." meta="24/7" />
            <InfoCard title="Administrative requests" description="A channel for non-technical institutional and membership concerns." meta="Office" />
          </div>
        </div>
      </PortalShell>
    </MemberRouteGuard>
  );
}
