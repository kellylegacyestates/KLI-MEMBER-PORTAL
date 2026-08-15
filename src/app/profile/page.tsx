import type { Metadata } from "next";
import { PortalShell } from "@/components/layout/PortalShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MemberProfileCard } from "@/components/features/profile/MemberProfileCard";
import { MemberRouteGuard } from "@/components/auth/ServerRouteGuards";

export const metadata: Metadata = {
  title: "Account",
  description: "Member profile and account settings for Kelly Legacy Institute.",
};

export default async function ProfilePage() {
  return (
    <MemberRouteGuard pathname="/profile">
      <PortalShell>
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Account"
              title="Member profile"
              description="Review and update your institutional identity, contact details, and professional interests."
            />
            <MemberProfileCard />
          </div>
        </PortalShell>
    </MemberRouteGuard>
  );
}
