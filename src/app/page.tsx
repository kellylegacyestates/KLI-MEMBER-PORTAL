export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f1de_0%,_#ffffff_60%)] text-slate-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,31,63,0.08)] backdrop-blur sm:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Kelly Legacy Institute
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              A member portal designed for trusted learning, research, and professional growth.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              This Next.js 15 foundation provides a responsive experience for members to access curated curriculum content, publications, and account tools in one place.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Launch status</p>
            <p className="mt-2 text-2xl font-semibold">Production-ready foundation</p>
            <p className="mt-2 text-sm text-slate-300">App Router, TypeScript, Tailwind, and ESLint are all wired up.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Responsive by default",
              body: "The layout adapts cleanly from mobile to desktop to support members wherever they sign in.",
            },
            {
              title: "Modern stack",
              body: "Built on Next.js 15 with TypeScript and Tailwind for a maintainable frontend foundation.",
            },
            {
              title: "Ready for growth",
              body: "The app structure is prepared for protected dashboards, API routes, and richer member experiences.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
