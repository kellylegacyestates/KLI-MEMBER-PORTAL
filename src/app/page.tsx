import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Member Portal",
  description: "A production-ready member platform for Kelly Legacy Institute with curriculum, research, briefings, publications, and account services.",
};

const highlights = [
  {
    title: "Institutional learning",
    body: "Members access a curated curriculum designed around fiduciary foundations, administrative records, and governance practice.",
  },
  {
    title: "Research and records",
    body: "The portal brings together trusted research materials, public records references, and professional briefings in one disciplined workflow.",
  },
  {
    title: "Member services",
    body: "The experience supports account management, billing visibility, documents, and continuing education in a format suited to institutional stewardship.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de] sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Kelly Legacy Institute</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            A production-ready member platform for institutional learning and stewardship.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8e2cf] sm:text-lg">
            The portal presents curriculum, research support, weekly briefings, publications, and account services in a coherent experience shaped for scholarly and administrative use.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#f5f1de]">Member Access</span>
            <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">Institutional Resources</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#f8f6ee] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Member experience</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001f3f]">Structured for research, instruction, and administration</h2>
            <p className="mt-4 text-base leading-8 text-[#243449]">
              Members can move from coursework and briefings to research materials and account management without losing the institutional tone of the platform.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#fffdf8] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Current priorities</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#243449]">
              <div className="rounded-2xl border border-[#d8d0bc] bg-white p-4">
                <p className="font-semibold text-[#001f3f]">Weekly fiduciary briefing</p>
                <p className="mt-1">A concise institutional update on governance, records, and fiduciary oversight.</p>
              </div>
              <div className="rounded-2xl border border-[#d8d0bc] bg-white p-4">
                <p className="font-semibold text-[#001f3f]">Member account overview</p>
                <p className="mt-1">Access to current learning, saved materials, and billing details in one place.</p>
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
