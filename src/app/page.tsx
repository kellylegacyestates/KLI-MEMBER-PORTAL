import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Overview",
  description: "A polished institutional landing view for the Kelly Legacy Institute member portal demonstration.",
};

const highlights = [
  {
    title: "Demonstration view",
    body: "This experience presents a refined front-end architecture for the Kelly Legacy Institute member portal, with realistic institutional sample content and no backend functionality yet.",
  },
  {
    title: "Research and records",
    body: "The layout supports curriculum, publications, archival references, and administrative workflows in a format suited to institutional stewardship.",
  },
  {
    title: "Member services",
    body: "Navigation and cards are designed to feel administrative and scholarly rather than consumer-oriented, supporting future integration with Supabase and Stripe.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de] sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Institutional Access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            A dignified member experience for Kelly Legacy Institute.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8e2cf] sm:text-lg">
            The interface is shaped to feel like a scholarly archive and administrative portal: restrained, orderly, and prepared for future member services.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#f5f1de]">Sample content</span>
            <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">Frontend refinement</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#f8f6ee] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Member surface</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001f3f]">Carefully structured for research, instruction, and administration</h2>
            <p className="mt-4 text-base leading-8 text-[#243449]">
              The portal presents curriculum, publications, briefings, and member service tools in a way that reflects institutional stewardship without overstating capabilities.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#fffdf8] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Current demonstration</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#243449]">
              <div className="rounded-2xl border border-[#d8d0bc] bg-white p-4">
                <p className="font-semibold text-[#001f3f]">Weekly briefing</p>
                <p className="mt-1">A sample briefing highlights the structure of future institutional communications.</p>
              </div>
              <div className="rounded-2xl border border-[#d8d0bc] bg-white p-4">
                <p className="font-semibold text-[#001f3f]">Standing ledger</p>
                <p className="mt-1">A demonstration record outlines how obligations and review tasks may be presented later.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#001f3f]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#243449]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
