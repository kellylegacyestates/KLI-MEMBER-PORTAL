import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Settings",
  description: "A settings view for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

export default function AdminSettingsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Administration" title="Settings" description="Configure portal preferences, institutional access, and service alignment." />
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoCard title="Portal configuration" description="Manage access policies and institutional display settings." />
          <InfoCard title="Service preferences" description="Coordinate member communications and administrative workflow defaults." />
        </div>
      </div>
    </AppShell>
  );
}
