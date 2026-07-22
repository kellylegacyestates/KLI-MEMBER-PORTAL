import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Courses",
  description: "A course catalog for the Kelly Legacy Institute member portal.",
};
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";

const courses = [
  { title: "Administrative Procedure", description: "A seminar-led course focused on formal process, record fidelity, and institutional review.", meta: "Live" },
  { title: "Research Methods", description: "A practical course for organizing archival sources, evidence, and reference materials.", meta: "Open" },
  { title: "Policy and Governance", description: "A structured study of governing principles, decision records, and policy stewardship.", meta: "Scheduled" },
];

export default function CoursesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader eyebrow="Courses" title="Course catalog" description="A carefully curated set of professional learning experiences for member advancement." />
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <InfoCard key={course.title} title={course.title} description={course.description} meta={course.meta} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
