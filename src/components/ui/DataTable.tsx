type Column = {
  key: string;
  header: string;
};

type DataTableProps = {
  title: string;
  columns: Column[];
  rows: Array<Record<string, React.ReactNode>>;
};

export function DataTable({ title, columns, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#d8d0bc] bg-white shadow-sm">
      <div className="border-b border-[#d8d0bc] bg-[#f8f6ee] px-6 py-4">
        <h3 className="text-lg font-semibold text-[#001f3f]">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-[#243449]">
          <thead className="bg-white text-xs uppercase tracking-[0.25em] text-[#d4af37]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-[#f0ebde]">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 align-top">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
