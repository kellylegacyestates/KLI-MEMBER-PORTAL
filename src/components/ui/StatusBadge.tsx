type StatusBadgeProps = {
  label: string;
  tone?: "navy" | "gold" | "parchment" | "ivory";
};

export function StatusBadge({ label, tone = "navy" }: StatusBadgeProps) {
  const toneClasses = {
    navy: "bg-[#001f3f] text-[#f5f1de]",
    gold: "bg-[#d4af37] text-[#001f3f]",
    parchment: "bg-[#f5f1de] text-[#001f3f]",
    ivory: "bg-[#f8f6ee] text-[#243449] border border-[#d8d0bc]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
