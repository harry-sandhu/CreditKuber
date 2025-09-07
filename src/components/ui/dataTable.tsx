import React, { useMemo, useState } from "react";

/**
 * Reusable DataTable component
 * ----------------------------
 * Usage:
 * <DataTable
 *   columns={[{ key: 'ref', label: 'Ref', render: (v,row)=>... }, ...]}
 *   rows={rows}
 *   idKey="id"
 *   defaultPageSize={10}
 *   onExportCsv={(csv) => {...}} // optional
 *   selectable // optional boolean to enable row selection
 * />
 *
 * Notes:
 * - Styling uses Tailwind + your theme CSS variables (eg. bg-[var(--color-surface)])
 * - Replace mocked export behavior by passing onExportCsv or let the component trigger a download
 * - For server-side pagination/filtering pass `rows` already filtered and set pageSize to match server.
 */

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (val: any, row: T) => React.ReactNode;
  width?: string; // optional tailwind width class (eg. 'w-40')
};

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  defaultPageSize = 10,
  idKey = "id",
  selectable = false,
  showGlobalSearch = true,
  showPageSizeSelector = true,
  onExportCsv,
}: {
  columns: Column<T>[];
  rows: T[];
  defaultPageSize?: number;
  idKey?: string;
  selectable?: boolean;
  showGlobalSearch?: boolean;
  showPageSizeSelector?: boolean;
  onExportCsv?: (csv: string) => void;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selected, setSelected] = useState<Record<string | number, boolean>>(
    {}
  );

  const filtered = useMemo(() => {
    if (!q) return rows;
    const lower = q.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [rows, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSelect(id: string | number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  /*  function selectAllOnPage(checked: boolean) {
    const ids = current.map((r) => (r as any)[idKey] ?? Math.random());
    setSelected((s) => {
      const copy = { ...s };
      ids.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }
*/
  function csvFromRows(rowsToExport: T[]) {
    if (!rowsToExport.length) return "";
    const keys = columns.map((c) => String(c.label));
    const header = keys.join(",");
    const lines = rowsToExport.map((r) =>
      columns
        .map((c) => {
          const key = c.key as string;
          const val = String((r as any)[key] ?? "");
          return '"' + val.replace(/"/g, '""') + '"';
        })
        .join(",")
    );
    return [header, ...lines].join("\n");
  }

  function exportCSV_page() {
    const csv = csvFromRows(current);
    if (onExportCsv) onExportCsv(csv);
    else {
      if (!csv) return alert("No data to export");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `export_${new Date().toISOString()}.csv`;
      link.click();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showGlobalSearch && (
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search..."
              className="px-3 py-2 border rounded w-64 bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
            />
          )}

          <button
            onClick={exportCSV_page}
            className="px-3 py-2 border rounded btn-ghost"
          >
            Export CSV (page)
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <div>Page size:</div>
          {showPageSizeSelector ? (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 border rounded bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          ) : (
            <div>{pageSize}</div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded bg-[var(--color-surface)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <table className="min-w-full">
          <thead>
            <tr>
              {selectable && (
                <th className="px-4 py-2 text-left text-sm text-[var(--color-muted)]">
                  {/* select column */}
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={`px-4 py-2 text-left text-sm text-[var(--color-muted)] ${
                    c.width ?? ""
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-4 text-center text-[var(--color-muted)]"
                >
                  No data
                </td>
              </tr>
            )}

            {current.map((r) => (
              <tr
                key={(r as any)[idKey] ?? Math.random()}
                className="hover:bg-surface/60 transition-colors"
              >
                {selectable && (
                  <td className="px-4 py-3 text-sm align-top">
                    <input
                      type="checkbox"
                      checked={!!selected[(r as any)[idKey]]}
                      onChange={() => toggleSelect((r as any)[idKey])}
                    />
                  </td>
                )}

                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className="px-4 py-3 text-sm align-top border-t border-[var(--color-border)]"
                  >
                    {c.render
                      ? c.render((r as any)[c.key as string], r)
                      : String((r as any)[c.key as string] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-muted)]">
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1} -{" "}
          {Math.min(filtered.length, (page + 1) * pageSize)} of{" "}
          {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded btn-ghost"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            First
          </button>
          <button
            className="px-3 py-1 border rounded btn-ghost"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          <div className="px-3 py-1 border rounded text-[var(--color-muted)]">
            {page + 1} / {pageCount}
          </div>
          <button
            className="px-3 py-1 border rounded btn-ghost"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
          >
            Next
          </button>
          <button
            className="px-3 py-1 border rounded btn-ghost"
            onClick={() => setPage(pageCount - 1)}
            disabled={page >= pageCount - 1}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
