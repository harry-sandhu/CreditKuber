import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Ticket = {
  id: number | string;
  ref?: string;
  borrower: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt?: string;
  assignedTo?: string;
  notes?: string;
};

const MOCK: Ticket[] = [
  {
    id: 1,
    ref: "T-1001",
    borrower: "Ravi Kumar",
    subject: "Loan repayment issue",
    status: "Open",
    createdAt: "2025-09-04",
    notes: "User claims payment not reflected.",
  },
  {
    id: 2,
    ref: "T-1002",
    borrower: "Anita Sharma",
    subject: "EMI not updated",
    status: "In Progress",
    createdAt: "2025-09-02",
    notes: "Checking with collections team.",
  },
  {
    id: 3,
    ref: "T-1003",
    borrower: "Vikas Mehta",
    subject: "Incorrect penalty",
    status: "Resolved",
    createdAt: "2025-08-29",
    notes: "Penalty waived after verification.",
  },
];

function csvFromRows(rows: Ticket[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "borrower",
    "subject",
    "status",
    "createdAt",
    "assignedTo",
    "notes",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

function statusClass(status: Ticket["status"]) {
  switch (status) {
    case "Open":
      return "bg-danger/10 text-danger border border-danger/20";
    case "In Progress":
      return "bg-warning/10 text-warning border border-warning/20";
    case "Resolved":
      return "bg-success/10 text-success border border-success/20";
    default:
      return "bg-[var(--glass-01)] text-[var(--color-text)] border border-[var(--color-border)]";
  }
}

export default function Tickets() {
  const [rows, setRows] = useState<Ticket[]>(MOCK);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | Ticket["status"] | "All"
  >("All");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Record<number | string, boolean>>(
    {}
  );
  const [viewing, setViewing] = useState<{ open: boolean; ticket?: Ticket }>({
    open: false,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter && statusFilter !== "All" && r.status !== statusFilter)
        return false;
      if (!q) return true;
      return [r.ref, r.borrower, r.subject, r.notes, r.assignedTo].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSelect(id: number | string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectAllOnPage(checked: boolean) {
    const pageIds = current.map((r) => r.id);
    setSelected((s) => {
      const copy = { ...s };
      pageIds.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }

  function exportCSV() {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tickets_${new Date().toISOString()}.csv`;
    link.click();
  }

  function exportSelected() {
    const ids = Object.keys(selected)
      .filter((k) => selected[k])
      .map((k) => k);
    if (!ids.length) return alert("No tickets selected");
    const rowsToExport = rows.filter((r) => ids.includes(String(r.id)));
    const csv = csvFromRows(rowsToExport);
    if (!csv) return alert("Nothing to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tickets_selected_${new Date().toISOString()}.csv`;
    link.click();
  }

  function openView(ticket: Ticket) {
    setViewing({ open: true, ticket });
  }

  function closeView() {
    setViewing({ open: false, ticket: undefined });
  }

  // mocked update — replace with API call
  async function updateTicket(updated: Ticket) {
    // simulate network
    await new Promise((r) => setTimeout(r, 400));
    setRows((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    closeView();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Support Tickets</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search borrower, subject, notes..."
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQuery("");
              setStatusFilter("All");
              setPage(0);
            }}
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={exportCSV}
          >
            Export
          </button>
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={exportSelected}
          >
            Export selected
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 rounded border bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-[var(--color-muted)]">
          Selected: {Object.values(selected).filter(Boolean).length}
        </div>
        <Button
          size="sm"
          className="btn-ghost"
          onClick={() => {
            const ids = Object.keys(selected)
              .filter((k) => selected[k])
              .map(Number);
            if (!ids.length) return alert("No tickets selected");
            // placeholder bulk action
            alert(`Marking ${ids.length} tickets as In Progress (mock)`);
            setRows((prev) =>
              prev.map((r) =>
                ids.includes(Number(r.id)) ? { ...r, status: "In Progress" } : r
              )
            );
          }}
        >
          Mark In Progress
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            const ids = Object.keys(selected)
              .filter((k) => selected[k])
              .map(Number);
            if (!ids.length) return alert("No tickets selected");
            if (!confirm(`Resolve ${ids.length} tickets?`)) return;
            setRows((prev) =>
              prev.map((r) =>
                ids.includes(Number(r.id)) ? { ...r, status: "Resolved" } : r
              )
            );
            setSelected({});
          }}
        >
          Resolve Selected
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2 text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  onChange={(e) => selectAllOnPage(e.target.checked)}
                />
              </th>
              <th className="p-2 text-[var(--color-muted)]">Ref</th>
              <th className="p-2 text-[var(--color-muted)]">Borrower</th>
              <th className="p-2 text-[var(--color-muted)]">Subject</th>
              <th className="p-2 text-[var(--color-muted)]">Created</th>
              <th className="p-2 text-[var(--color-muted)]">Status</th>
              <th className="p-2 text-[var(--color-muted)]">Assigned</th>
              <th className="p-2 text-[var(--color-muted)]">Action</th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-[var(--color-muted)]"
                >
                  No tickets
                </td>
              </tr>
            )}

            {current.map((t) => (
              <tr key={t.id} className="hover:bg-surface/60 transition-colors">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selected[t.id]}
                    onChange={() => toggleSelect(t.id)}
                  />
                </td>
                <td className="p-2 text-[var(--color-text)]">{t.ref ?? "-"}</td>
                <td className="p-2 text-[var(--color-text)]">{t.borrower}</td>
                <td className="p-2 text-[var(--color-text)]">{t.subject}</td>
                <td className="p-2 text-[var(--color-muted)] text-sm">
                  {t.createdAt ?? "-"}
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-2 text-[var(--color-text)]">
                  {t.assignedTo ?? "-"}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="btn-ghost"
                      onClick={() => openView(t)}
                    >
                      View
                    </Button>
                    <Button size="sm" onClick={() => openView(t)}>
                      Update
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        <div className="flex items-center justify-between mt-3">
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
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 rounded border bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View/Update modal */}
      {viewing.open && viewing.ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeView}
          ></div>

          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Ticket {viewing.ticket.ref} — {viewing.ticket.borrower}
            </h3>

            <div className="mt-3">
              <div className="text-sm text-[var(--color-muted)]">Subject</div>
              <div className="font-medium text-[var(--color-text)]">
                {viewing.ticket.subject}
              </div>

              <div className="text-sm text-[var(--color-muted)] mt-3">
                Notes
              </div>
              <textarea
                id="ticket-notes"
                defaultValue={viewing.ticket.notes}
                rows={4}
                className="w-full mt-1 rounded border p-2 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
              ></textarea>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <label className="text-sm text-[var(--color-muted)]">
                  Status
                </label>
                <select
                  id="ticket-status"
                  defaultValue={viewing.ticket.status}
                  className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="mt-3 flex gap-2">
                <label className="text-sm text-[var(--color-muted)]">
                  Assign to (optional)
                </label>
                <input
                  id="ticket-assign"
                  placeholder="agent name"
                  className="ml-auto px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" className="btn-ghost" onClick={closeView}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const notesEl = document.getElementById(
                    "ticket-notes"
                  ) as HTMLTextAreaElement | null;
                  const statusEl = document.getElementById(
                    "ticket-status"
                  ) as HTMLSelectElement | null;
                  const assignEl = document.getElementById(
                    "ticket-assign"
                  ) as HTMLInputElement | null;
                  const notes = notesEl?.value ?? "";
                  const status = (statusEl?.value ??
                    viewing.ticket?.status) as Ticket["status"];
                  const assignedTo = assignEl?.value || undefined;

                  if (!viewing.ticket) return;
                  updateTicket({
                    ...viewing.ticket,
                    notes,
                    status,
                    assignedTo,
                  });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
