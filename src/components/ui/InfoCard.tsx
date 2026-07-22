type InfoCardProps = {
  title: string;
  description: string;
  meta?: string;
  children?: React.ReactNode;
};

export function InfoCard({ title, description, meta, children }: InfoCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-[#d8d0bc] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#001f3f]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#243449]">{description}</p>
        </div>
        {meta ? <span className="rounded-full bg-[#f5f1de] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#001f3f]">{meta}</span> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
