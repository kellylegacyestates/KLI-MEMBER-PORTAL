import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const curriculum = [
  { title: "The Record", description: "Foundational principles for institutional records, evidentiary structure, and review discipline.", meta: "Module 1" },
  { title: "Parties and Capacity", description: "An analysis of standing, participation, and procedural rights within institutional systems.", meta: "Module 2" },
  { title: "Standing and Jurisdiction", description: "A practical study of authority, venue, and review pathways.", meta: "Module 3" },
  { title: "Evidence and Burdens", description: "Structured work on proof, obligations, and decision records.", meta: "Module 4" },
];

export default function CurriculumPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Member Curriculum" title="Curriculum overview" description="A scholarly sequence of learning modules developed for institutional members and professional stewards." />
        <div className="grid gap-6 md:grid-cols-2">
          {curriculum.map((item) => (
            <InfoCard key={item.title} title={item.title} description={item.description} meta={item.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
