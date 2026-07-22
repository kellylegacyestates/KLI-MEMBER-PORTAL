import { AppShell } from "@/components/layout/AppShell";

const highlights = [
  {
    title: "Current Access",
    body: "Review the most recent institutional briefings, curriculum milestones, and research updates shared with your member cohort.",
  },
  {
    title: "Standing Ledger",
    body: "Track obligations, reading assignments, and pending materials with the same clarity expected of a formal archive.",
  },
  {
    title: "Support Channels",
    body: "Connect with member services for account guidance, document access, and administrative assistance.",
  },
];

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de] sm:p-10">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Institutional Access</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            A professional member experience for the Kelly Legacy Institute.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8e2cf] sm:text-lg">
            This application shell brings together curriculum, research resources, publications, and stewardship tools in a format aligned with a university, archive, or federal research institution.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#f8f6ee] p-8">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Member Dashboard</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#001f3f]">Stewardship, scholarship, and secure access</h2>
            <p className="mt-4 text-base leading-8 text-[#243449]">
              Members can move between research materials, publications, and administrative services without leaving the institutional framework established for trusted access.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#d8d0bc] bg-[#001f3f] p-8 text-[#f5f1de]">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#d4af37]">Today</p>
            <div className="mt-4 space-y-4 text-sm leading-7">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-semibold">Weekly Briefing</p>
                <p className="mt-1 text-[#e8e2cf]">New material added to the member review queue.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-semibold">Standing Ledger</p>
                <p className="mt-1 text-[#e8e2cf]">Two pending items require attention before the next session.</p>
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
