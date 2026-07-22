import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Profile",
  description: "A sample profile view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Profile" title="Member profile" description="A central record for institutional identity, contact details, and professional interests." />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <InfoCard title="Member information" description="Institutional profile details maintained for service and communications.">
            <div className="space-y-3 text-sm text-[#243449]">
              <p><span className="font-semibold text-[#001f3f]">Name:</span> Jordan Ellis</p>
              <p><span className="font-semibold text-[#001f3f]">Institution:</span> Kelly Legacy Institute</p>
              <p><span className="font-semibold text-[#001f3f]">Role:</span> Fellow member</p>
            </div>
          </InfoCard>
          <InfoCard title="Preferences" description="Communication and document access settings for the member experience." />
        </div>
      </div>
    </AppShell>
  );
}
