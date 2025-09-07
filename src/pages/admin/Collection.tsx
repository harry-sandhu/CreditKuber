// src/pages/admin/Collection.tsx
import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CollectionRow = {
  id: number;
  ref: string;
  branch?: string;
  borrower: string;
  mobile?: string;
  loanAmount?: number;
  repaymentDate?: string; // ISO date
  creditBy?: string; // who credited
  fiDoneBy?: string; // field inspector or FI
  status?:
    | "Payday"
    | "Pending"
    | "Part Payment"
    | "Closed"
    | "Settlement"
    | "PP Closed"
    | string;
  assignedTo?: string | null;
  notes?: string;
};

const PRESETS = [
  "All",
  "Payday",
  "Pending",
  "Part Payment",
  "Closed",
  "Settlement",
  "PP Closed",
] as const;

const MOCK: CollectionRow[] = [
  {
    id: 1,
    ref: "C-4001",
    branch: "Patiala",
    borrower: "Ravi Kumar",
    mobile: "+91 98765 43210",
    loanAmount: 50000,
    repaymentDate: "2025-09-15",
    creditBy: "caller01",
    fiDoneBy: "fi01",
    status: "Pending",
    assignedTo: "collector01",
    notes: "",
  },
  {
    id: 2,
    ref: "C-4002",
    branch: "Ambala",
    borrower: "Anita Sharma",
    mobile: "+91 87654 32109",
    loanAmount: 30000,
    repaymentDate: "2025-09-10",
    creditBy: "caller02",
    fiDoneBy: "fi02",
    status: "Part Payment",
    assignedTo: "collector02",
    notes: "Partial paid 5k",
  },
  {
    id: 3,
    ref: "C-4003",
    branch: "Chandigarh",
    borrower: "Sunita Devi",
    mobile: "+91 99887 66554",
    loanAmount: 25000,
    repaymentDate: "2025-09-20",
    creditBy: "",
    fiDoneBy: "",
    status: "Payday",
    assignedTo: null,
    notes: "",
  },
];

function csvFromRows(rows: CollectionRow[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "branch",
    "borrower",
    "mobile",
    "loanAmount",
    "repaymentDate",
    "creditBy",
    "fiDoneBy",
    "status",
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

/* ---------------- Collection Drawer ---------------- */
function CollectionDrawer({
  viewing,
  close,
  onLogPayment,
}: {
  viewing: { open: boolean; row?: CollectionRow };
  close: () => void;
  onLogPayment: (row: CollectionRow) => void;
}) {
  if (!viewing.open || !viewing.row) return null;
  const r = viewing.row;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full max-w-md h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Collection — {r.ref}</h3>
          <Button size="sm" className="btn-ghost" onClick={close}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <strong>Borrower:</strong> {r.borrower}
          </div>
          <div>
            <strong>Mobile:</strong> {r.mobile ?? "-"}
          </div>
          <div>
            <strong>Branch:</strong> {r.branch ?? "-"}
          </div>
          <div>
            <strong>Loan Amount:</strong>{" "}
            {r.loanAmount ? `₹${r.loanAmount.toLocaleString()}` : "-"}
          </div>
          <div>
            <strong>Repayment Date:</strong> {r.repaymentDate ?? "-"}
          </div>
          <div>
            <strong>Credit By:</strong> {r.creditBy ?? "-"}
          </div>
          <div>
            <strong>FI Done By:</strong> {r.fiDoneBy ?? "-"}
          </div>
          <div>
            <strong>Status:</strong> {r.status}
          </div>
          <div>
            <strong>Assigned:</strong> {r.assignedTo ?? "-"}
          </div>
          <div>
            <strong>Notes:</strong> {r.notes ?? "-"}
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => onLogPayment(r)}>
              Log Payment
            </Button>
            {r.status !== "Closed" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("Mark closed (mock)?")) return;
                  alert("Marked closed (mock)");
                }}
              >
                Mark Closed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function Collection() {
  const [rows, setRows] = useState<CollectionRow[]>(MOCK);
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("All");
  const [query, setQuery] = useState("");
  const [colMobile, setColMobile] = useState("");
  const [fromDate, setFromDate] = useState<string | "">("");
  const [toDate, setToDate] = useState<string | "">("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(10);

  // UI: drawer + log payment modal
  const [viewing, setViewing] = useState<{
    open: boolean;
    row?: CollectionRow;
  }>({ open: false });
  const [logging, setLogging] = useState<{
    open: boolean;
    row?: CollectionRow;
    amount?: number;
    date?: string;
  }>({ open: false });

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (preset !== "All" && r.status !== preset) return false;
      if (colMobile && !(r.mobile ?? "").includes(colMobile)) return false;
      if (fromDate) {
        const from = new Date(fromDate);
        const d = r.repaymentDate ? new Date(r.repaymentDate) : null;
        if (!d || d < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        const d = r.repaymentDate ? new Date(r.repaymentDate) : null;
        if (!d || d > to) return false;
      }
      if (!lower) return true;
      return [r.ref, r.borrower, r.branch, r.mobile, r.assignedTo].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, preset, query, colMobile, fromDate, toDate]);

  const toggleSelect = useCallback(
    (id: number) => setSelected((s) => ({ ...s, [id]: !s[id] })),
    []
  );
  /*  const selectAllOnPage = useCallback((ids: number[], checked: boolean) => {
    setSelected((s) => {
      const copy = { ...s };
      ids.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }, []);
  */

  const exportFiltered = useCallback(() => {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `collection_${new Date().toISOString()}.csv`;
    link.click();
  }, [filtered]);

  const exportSelected = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    const rowsToExport = rows.filter((r) => ids.includes(r.id));
    const csv = csvFromRows(rowsToExport);
    if (!csv) return alert("No data");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `collection_selected_${new Date().toISOString()}.csv`;
    link.click();
  }, [selected, rows]);

  const bulkMarkClosed = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    if (!confirm(`Mark ${ids.length} rows as Closed (mock)?`)) return;
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status: "Closed" } : r))
    );
    setSelected({});
    alert(`Marked ${ids.length} rows as Closed (mock)`);
  }, [selected]);

  const bulkAssignCollector = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id) ? { ...r, assignedTo: "collector-bulk" } : r
      )
    );
    setSelected({});
    alert(`Assigned ${ids.length} rows to collector-bulk (mock)`);
  }, [selected]);

  // Log payment modal handlers (mocked)
  function openLogPayment(row: CollectionRow) {
    setLogging({
      open: true,
      row,
      amount: row.loanAmount ? Math.min(1000, row.loanAmount) : 0,
      date: new Date().toISOString().slice(0, 10),
    });
  }
  async function performLogPayment() {
    const row = logging.row;
    const amount = logging.amount;
    const date = logging.date;
    setLogging({ open: false });
    if (!row || !amount || !date) return;
    // TODO: API to log payment
    await new Promise((r) => setTimeout(r, 300));
    setRows((prev) =>
      prev.map((p) =>
        p.id === row.id
          ? {
              ...p,
              notes: `${p.notes ?? ""}\nPayment ${amount} on ${date}`.trim(),
              status: p.status === "Pending" ? "Part Payment" : p.status,
            }
          : p
      )
    );
    alert(`Logged payment ₹${amount} for ${row.ref} (mock)`);
  }

  function openView(row: CollectionRow) {
    setViewing({ open: true, row });
  }
  function closeView() {
    setViewing({ open: false, row: undefined });
  }

  const columns = useMemo(
    () => [
      {
        key: "select",
        label: "",
        width: "w-12",
        render: (_: any, row: CollectionRow) => (
          <input
            aria-label={`select-${row.ref}`}
            type="checkbox"
            checked={!!selected[row.id]}
            onChange={() => toggleSelect(row.id)}
          />
        ),
      },
      { key: "ref", label: "Ref", width: "w-28" },
      { key: "branch", label: "Branch" },
      { key: "borrower", label: "Borrower" },
      { key: "mobile", label: "Mobile" },
      {
        key: "loanAmount",
        label: "Loan Amount",
        render: (v: any) => (v ? `₹${Number(v).toLocaleString()}` : "-"),
      },
      { key: "repaymentDate", label: "Repayment Date" },
      { key: "creditBy", label: "Credit By" },
      { key: "fiDoneBy", label: "FI Done By" },
      {
        key: "status",
        label: "Status",
        render: (v: any) => (
          <span className="px-2 py-1 rounded bg-[var(--glass-01)] text-sm">
            {String(v ?? "-")}
          </span>
        ),
      },
      { key: "assignedTo", label: "Assigned" },
      {
        key: "actions",
        label: "Action",
        width: "w-44",
        render: (_: any, row: CollectionRow) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => openView(row)}
            >
              View
            </Button>
            <Button size="sm" onClick={() => openLogPayment(row)}>
              Log Payment
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (!confirm("Settle (mock)?")) return;
                setRows((prev) =>
                  prev.map((p) =>
                    p.id === row.id ? { ...p, status: "Settlement" } : p
                  )
                );
                alert("Settled (mock)");
              }}
            >
              Settle
            </Button>
          </div>
        ),
      },
    ],
    [selected, toggleSelect]
  );

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Collection</h1>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ref, borrower, branch, mobile..."
              className="w-80"
            />
            <Input
              value={colMobile}
              onChange={(e) => setColMobile(e.target.value)}
              placeholder="Mobile column search"
              className="w-56"
            />
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as any)}
              className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-muted)]">From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1 border rounded"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-muted)]">To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1 border rounded"
              />
            </label>

            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={() => {
                setQuery("");
                setColMobile("");
                setPreset("All");
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportFiltered}
            >
              Export
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportSelected}
            >
              Export selected
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={bulkMarkClosed}
            >
              Bulk mark closed
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={bulkAssignCollector}
            >
              Bulk assign collector
            </button>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
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

      <DataTable
        columns={columns}
        rows={filtered}
        idKey="id"
        defaultPageSize={pageSize}
        showGlobalSearch={false}
        showPageSizeSelector={false}
      />

      {/* Log Payment modal */}
      {logging.open && logging.row && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setLogging({ open: false })}
          />
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Log Payment — {logging.row.ref}
            </h3>
            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Amount
              </label>
              <input
                type="number"
                value={logging.amount ?? 0}
                onChange={(e) =>
                  setLogging((s) => ({ ...s, amount: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Date
              </label>
              <input
                type="date"
                value={logging.date ?? ""}
                onChange={(e) =>
                  setLogging((s) => ({ ...s, date: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setLogging({ open: false })}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => performLogPayment()}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <CollectionDrawer
        viewing={viewing}
        close={closeView}
        onLogPayment={(r) => openLogPayment(r)}
      />
    </div>
  );
}
