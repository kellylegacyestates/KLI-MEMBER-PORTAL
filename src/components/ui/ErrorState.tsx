type ErrorStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-[#d8d0bc] bg-[#fffdf8] p-8 shadow-sm">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#d4af37]">Notice</p>
      <h3 className="mt-3 text-xl font-semibold text-[#001f3f]">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#243449]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
