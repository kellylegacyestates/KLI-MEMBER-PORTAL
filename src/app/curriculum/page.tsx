import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { curriculumModules } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "The curriculum pathway for Kelly Legacy Institute members, centered on fiduciary foundations and procedural practice.",
};

export default function CurriculumPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Member Curriculum"
          title="Fiduciary Foundations"
          description="A structured curriculum pathway for institutional members and professional stewards at Kelly Legacy Institute."
        />

        <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#f8f6ee] p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">Program overview</p>
          <p className="mt-3 text-base leading-8 text-[#243449]">
            The curriculum is organized around records, standing, evidence, and trust administration so members can work through institutional concepts in a clear and cumulative sequence.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {curriculumModules.map((module) => (
            <InfoCard key={module.title} title={module.title} description={module.description} meta={module.progress}>
              <div className="space-y-4">
                <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#f8f6ee] p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Lesson cards</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-[#243449]">
                    {module.lessonCards.map((item) => (
                      <li key={item} className="rounded-2xl border border-[#d8d0bc] bg-white px-3 py-2">{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-white p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Reading assignments</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-[#243449]">
                    {module.readingAssignments.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#001f3f] p-4 text-[#f5f1de]">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Downloads</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7">
                    {module.downloads.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#fffdf8] p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Video placeholder</p>
                  <p className="mt-3 text-sm leading-7 text-[#243449]">{module.videoPlaceholder}</p>
                </div>

                <div className="rounded-[1.25rem] border border-[#d8d0bc] bg-[#f8f6ee] p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">Personal notes</p>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-[#243449]">
                    {module.notes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
