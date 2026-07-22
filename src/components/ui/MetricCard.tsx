type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "navy" | "gold" | "parchment";
};

export function MetricCard({ label, value, detail, tone = "navy" }: MetricCardProps) {
  const toneClasses = {
    navy: "bg-[#001f3f] text-[#f5f1de]",
    gold: "bg-[#d4af37] text-[#001f3f]",
    parchment: "bg-[#f5f1de] text-[#001f3f]",
  };

  return (
    <div className={`rounded-[1.5rem] border border-[#d8d0bc] p-6 shadow-sm transition duration-300 hover:-translate-y-1 ${toneClasses[tone]}`}>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] opacity-80">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-7 opacity-90">{detail}</p>
    </div>
  );
}
