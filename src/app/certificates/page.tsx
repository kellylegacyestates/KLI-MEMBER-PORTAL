import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Certificates",
  description: "A certificates area for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const certificates = [
  { title: "Research Foundations", description: "Awarded for successful completion of the introductory research sequence.", meta: "Issued" },
  { title: "Professional Stewardship", description: "Awarded for completion of policy and governance materials.", meta: "Issued" },
  { title: "Institutional Practice", description: "Awarded for participation in the member seminar series.", meta: "Pending" },
];

export default function CertificatesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Certificates" title="Member certificates" description="A record of completed coursework and professional achievements issued through the portal." />
        <div className="grid gap-6 md:grid-cols-3">
          {certificates.map((certificate) => (
            <InfoCard key={certificate.title} title={certificate.title} description={certificate.description} meta={certificate.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
