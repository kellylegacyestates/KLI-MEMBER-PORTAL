type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[#d8d0bc] bg-[#f8f6ee] p-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-[#001f3f]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#243449]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
