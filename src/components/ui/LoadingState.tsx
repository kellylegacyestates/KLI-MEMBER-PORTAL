export function LoadingState({ label = "Loading institutional materials" }: { label?: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-[1.5rem] border border-[#d8d0bc] bg-white/80 p-8 shadow-sm">
      <div className="flex items-center gap-4 text-[#001f3f]">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#d4af37]" />
        <span className="text-sm font-medium uppercase tracking-[0.3em]">{label}</span>
      </div>
    </div>
  );
}
