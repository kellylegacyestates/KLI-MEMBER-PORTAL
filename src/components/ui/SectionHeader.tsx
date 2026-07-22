type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function SectionHeader({ eyebrow, title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#d8d0bc] pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#001f3f]">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-[#243449]">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
