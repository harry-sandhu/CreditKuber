import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Overdue = {
  id: number;
  ref?: string;
  borrower: string;
  phone?: string;
  amount: number;
  dueDate: string; // yyyy-mm-dd or display
  daysPast?: number;
  branch?: string;
  assignedTo?: string;
  notes?: string;
};

const MOCK: Overdue[] = [
  {
    id: 1,
    ref: "L-1001",
    borrower: "Ravi Kumar",
    phone: "+91 98765 43210",
    amount: 15000,
    dueDate: "2025-08-10",
    daysPast: 28,
    branch: "Patiala",
  },
  {
    id: 2,
    ref: "L-1002",
    borrower: "Anita Sharma",
    phone: "+91 87654 32109",
    amount: 25000,
    dueDate: "2025-07-28",
    daysPast: 41,
    branch: "Ambala",
  },
  {
    id: 3,
    ref: "L-1003",
    borrower: "Sunita Devi",
    phone: "+91 99887 66554",
    amount: 8000,
    dueDate: "2025-08-30",
    daysPast: 8,
    branch: "Chandigarh",
  },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function csvFromRows(rows: Overdue[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "borrower",
    "phone",
    "amount",
    "dueDate",
    "daysPast",
    "branch",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export default function Overdues() {
  const [rows, setRows] = useState<Overdue[]>(MOCK);
  const [query, setQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [minDays, setMinDays] = useState<number | "">("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [reminderModal, setReminderModal] = useState<{
    open: boolean;
    row?: Overdue;
    message: string;
  }>({ open: false, row: undefined, message: "" });

  const branches = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.branch).filter(Boolean))
      ) as string[],
    [rows]
  );

  // filtering + search
  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (branchFilter && r.branch !== branchFilter) return false;
      if (
        minDays !== "" &&
        r.daysPast !== undefined &&
        r.daysPast < Number(minDays)
      )
        return false;
      if (!lower) return true;
      return [r.ref, r.borrower, r.phone, r.branch, String(r.amount)].some(
        (v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(lower)
      );
    });
  }, [rows, query, branchFilter, minDays]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSelect(id: number) {
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
    link.download = `overdues_${new Date().toISOString()}.csv`;
    link.click();
  }

  function bulkSendReminder() {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No loans selected");
    const targeted = rows.filter((r) => ids.includes(r.id));
    alert(
      `Sending reminders to: ${targeted
        .map((t) => t.borrower + " (" + (t.phone ?? "-") + ")")
        .join(", ")}`
    );
    // TODO: call API to actually send reminders
  }

  function bulkEscalate() {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No loans selected");
    if (!confirm(`Escalate ${ids.length} loans? This will notify managers.`))
      return;
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? { ...r, notes: (r.notes ?? "") + " • Escalated" }
          : r
      )
    );
    setSelected({});
  }

  function markPaid(id: number) {
    if (!confirm("Mark this loan as paid?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function openReminder(row?: Overdue) {
    setReminderModal({
      open: true,
      row,
      message: row
        ? `Dear ${row.borrower}, your payment of ${formatCurrency(
            row.amount
          )} was due on ${row.dueDate}. Please pay immediately.`
        : "",
    });
  }

  function sendReminder(rowId?: number) {
    const msg = reminderModal.message.trim();
    if (!msg) return alert("Enter a message");
    const target = rowId ? rows.find((r) => r.id === rowId) : undefined;
    alert(
      `Sending reminder${
        target ? " to " + target.borrower : " to selected"
      }: "${msg}"`
    );
    setReminderModal({ open: false, row: undefined, message: "" });
    // TODO: call backend to send SMS/WhatsApp/email
  }

  function escalateRow(id: number) {
    if (!confirm("Escalate this loan to recovery team?")) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, notes: (r.notes ?? "") + " • Escalated" } : r
      )
    );
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Overdue Loans</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search borrower, phone, ref..."
            className="w-64"
          />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="">All branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <Input
            value={minDays === "" ? "" : String(minDays)}
            onChange={(e) =>
              setMinDays(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Min days past due"
            className="w-40"
          />
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQuery("");
              setBranchFilter("");
              setMinDays("");
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
          onClick={() => openReminder(undefined)}
        >
          Compose Reminder
        </Button>
        <Button size="sm" onClick={bulkSendReminder}>
          Send Reminder
        </Button>
        <Button size="sm" variant="destructive" onClick={bulkEscalate}>
          Escalate
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="overflow-x-auto">
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
                <th className="p-2 text-[var(--color-muted)]">Phone</th>
                <th className="p-2 text-[var(--color-muted)]">Amount</th>
                <th className="p-2 text-[var(--color-muted)]">Due Date</th>
                <th className="p-2 text-[var(--color-muted)]">Days Past</th>
                <th className="p-2 text-[var(--color-muted)]">Branch</th>
                <th className="p-2 text-[var(--color-muted)]">Action</th>
              </tr>
            </thead>

            <tbody>
              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-4 text-center text-[var(--color-muted)]"
                  >
                    No overdue loans
                  </td>
                </tr>
              )}

              {current.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface/60 transition-colors"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[r.id]}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {r.ref ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">{r.borrower}</td>
                  <td className="p-2 text-[var(--color-text)]">
                    {r.phone ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">{r.dueDate}</td>
                  <td className="p-2 text-[var(--color-text)]">
                    {r.daysPast ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {r.branch ?? "-"}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => openReminder(r)}>
                        Send Reminder
                      </Button>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() => markPaid(r.id)}
                      >
                        Mark Paid
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => escalateRow(r.id)}
                      >
                        Escalate
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
          </div>
        </div>
      </div>

      {/* Reminder modal */}
      {reminderModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setReminderModal({ open: false, message: "", row: undefined })
            }
          ></div>

          <div className="relative w-full max-w-lg p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Send Reminder{" "}
              {reminderModal.row ? `— ${reminderModal.row.borrower}` : ""}
            </h3>

            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Message
              </label>
              <textarea
                value={reminderModal.message}
                onChange={(e) =>
                  setReminderModal((s) => ({ ...s, message: e.target.value }))
                }
                rows={5}
                className="w-full rounded border p-2 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() =>
                  setReminderModal({ open: false, message: "", row: undefined })
                }
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (reminderModal.row) sendReminder(reminderModal.row.id);
                  else {
                    // send to selected
                    const ids = Object.keys(selected)
                      .filter((k) => selected[Number(k)])
                      .map(Number);
                    if (!ids.length) return alert("No loans selected");
                    // For demo, just alert
                    alert(
                      `Sending to ${ids.length} selected loans: ${reminderModal.message}`
                    );
                    setReminderModal({
                      open: false,
                      message: "",
                      row: undefined,
                    });
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
