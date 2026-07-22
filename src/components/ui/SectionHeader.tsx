type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: string;
};

export function SectionHeader({ eyebrow, title, description, actions, badge }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#d8d0bc] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">{eyebrow}</p>
          {badge ? <span className="rounded-full border border-[#d8d0bc] bg-[#f8f6ee] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#243449]">{badge}</span> : null}
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-[#001f3f] sm:text-[1.7rem]">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-[#243449]">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
