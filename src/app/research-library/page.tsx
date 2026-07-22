import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InfoCard } from "@/components/ui/InfoCard";
import { researchCategories, researchItems } from "@/lib/institutionalContent";

export const metadata: Metadata = {
  title: "Research Library",
  description: "The research library collection for Kelly Legacy Institute members, with trusted materials across governance, law, banking, and policy.",
};

export default function ResearchLibraryPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          eyebrow="Research Library"
          title="Reference collection"
          description="A research library experience shaped for institutional scholarship, public stewardship, and professional reference."
        />

        <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#f8f6ee] p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">Collections by category</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {researchCategories.map((category) => (
              <span key={category} className="rounded-full border border-[#d8d0bc] bg-white px-3 py-2 text-sm text-[#243449]">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {researchItems.map((item) => (
            <InfoCard key={item.title} title={item.title} description={item.abstract} meta={item.category}>
              <div className="space-y-3 text-sm leading-7 text-[#243449]">
                <p><span className="font-semibold text-[#001f3f]">Author:</span> {item.author}</p>
                <p><span className="font-semibold text-[#001f3f]">Publication date:</span> {item.published}</p>
                <p><span className="font-semibold text-[#001f3f]">Category:</span> {item.category}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="button" className="rounded-full border border-[#d8d0bc] bg-[#f8f6ee] px-3 py-2 text-sm font-medium text-[#001f3f]">Bookmark</button>
                  <button type="button" className="rounded-full bg-[#d4af37] px-3 py-2 text-sm font-semibold text-[#001f3f]">{item.downloadLabel}</button>
                </div>
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
