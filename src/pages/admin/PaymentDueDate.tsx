// src/pages/admin/PaymentDueDate.tsx
import React, { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DueRow = {
  id: number;
  ref: string;
  name: string;
  mobile?: string;
  dueDate?: string; // ISO date
  amount?: number;
  status?: "Upcoming" | "Due" | "Overdue" | "Closed" | string;
  assignedTo?: string | null;
  notes?: string;
};

const TEMPLATES = [
  "All",
  "Above 60 days",
  "Below 60 days",
  "Next 7 days",
] as const;

const MOCK: DueRow[] = [
  {
    id: 1,
    ref: "P-5001",
    name: "Ravi Kumar",
    mobile: "+91 98765 43210",
    dueDate: "2025-06-01",
    amount: 15000,
    status: "Overdue",
    assignedTo: "collector01",
    notes: "",
  },
  {
    id: 2,
    ref: "P-5002",
    name: "Anita Sharma",
    mobile: "+91 87654 32109",
    dueDate: "2025-08-18",
    amount: 8000,
    status: "Overdue",
    assignedTo: null,
    notes: "Partial paid",
  },
  {
    id: 3,
    ref: "P-5003",
    name: "Sunita Devi",
    mobile: "+91 99887 66554",
    dueDate: "2025-09-20",
    amount: 5000,
    status: "Upcoming",
    assignedTo: "collector02",
    notes: "",
  },
];

function daysBetween(dateStr?: string) {
  if (!dateStr) return null;
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff; // positive = past
}

function csvFromRows(rows: DueRow[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "name",
    "mobile",
    "dueDate",
    "amount",
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

/* ---------------- Drawer ---------------- */
function DueDrawer({
  viewing,
  close,
  onRemind,
}: {
  viewing: { open: boolean; row?: DueRow };
  close: () => void;
  onRemind: (row: DueRow) => void;
}) {
  if (!viewing.open || !viewing.row) return null;
  const r = viewing.row;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full max-w-md h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Payment Due — {r.ref}</h3>
          <Button size="sm" className="btn-ghost" onClick={close}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <strong>Name:</strong> {r.name}
          </div>
          <div>
            <strong>Mobile:</strong> {r.mobile ?? "-"}
          </div>
          <div>
            <strong>Due Date:</strong> {r.dueDate ?? "-"}
          </div>
          <div>
            <strong>Days Past:</strong> {daysBetween(r.dueDate) ?? "-"}
          </div>
          <div>
            <strong>Amount:</strong>{" "}
            {r.amount ? `₹${r.amount.toLocaleString()}` : "-"}
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
            <Button size="sm" onClick={() => onRemind(r)}>
              Send Reminder
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (!confirm("Escalate (mock)?")) return;
                alert("Escalated (mock)");
              }}
            >
              Escalate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function PaymentDueDate() {
  const [rows, setRows] = useState<DueRow[]>(MOCK);
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]>("All");
  const [query, setQuery] = useState("");
  const [colMobile, setColMobile] = useState("");
  const [fromDate, setFromDate] = useState<string | "">("");
  const [toDate, setToDate] = useState<string | "">("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(10);

  // drawer state
  const [viewing, setViewing] = useState<{ open: boolean; row?: DueRow }>({
    open: false,
  });

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();

    return rows.filter((r) => {
      // template buckets
      const days = daysBetween(r.dueDate);
      if (template === "Above 60 days" && (days === null || days <= 60))
        return false;
      if (template === "Below 60 days" && (days === null || days > 60))
        return false;
      if (template === "Next 7 days") {
        // upcoming payments in next 7 days: dueDate is in future within 7 days
        if (!r.dueDate) return false;
        const now = new Date();
        const d = new Date(r.dueDate);
        const diff = Math.floor(
          (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff < 0 || diff > 7) return false;
      }

      if (colMobile && !(r.mobile ?? "").includes(colMobile)) return false;
      if (fromDate) {
        const from = new Date(fromDate);
        const d = r.dueDate ? new Date(r.dueDate) : null;
        if (!d || d < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        const d = r.dueDate ? new Date(r.dueDate) : null;
        if (!d || d > to) return false;
      }

      if (!lower) return true;
      return [r.ref, r.name, r.mobile, r.assignedTo].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, template, query, colMobile, fromDate, toDate]);

  const toggleSelect = useCallback(
    (id: number) => setSelected((s) => ({ ...s, [id]: !s[id] })),
    []
  );
  const selectAllOnPage = useCallback(
    (ids: number[], checked: boolean) =>
      setSelected((s) => {
        const c = { ...s };
        ids.forEach((i) => (c[i] = checked));
        return c;
      }),
    []
  );

  const exportFiltered = useCallback(() => {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment_due_${new Date().toISOString()}.csv`;
    link.click();
  }, [filtered]);

  const exportSelected = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    const toExport = rows.filter((r) => ids.includes(r.id));
    const csv = csvFromRows(toExport);
    if (!csv) return alert("No data");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payment_due_selected_${new Date().toISOString()}.csv`;
    link.click();
  }, [selected, rows]);

  const bulkRemind = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    // mock
    alert(`Sent reminders to ${ids.length} borrowers (mock)`);
    setSelected({});
  }, [selected]);

  const bulkEscalate = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    if (!confirm(`Escalate ${ids.length} rows?`)) return;
    alert(`Escalated ${ids.length} rows (mock)`);
    setSelected({});
  }, [selected]);

  function openView(row: DueRow) {
    setViewing({ open: true, row });
  }
  function closeView() {
    setViewing({ open: false, row: undefined });
  }

  function onRemind(row: DueRow) {
    // mock reminder
    alert(`Reminder sent (mock) to ${row.name} ${row.mobile ?? ""}`);
  }

  const columns = useMemo(
    () => [
      {
        key: "select",
        label: "",
        width: "w-12",
        render: (_: any, row: DueRow) => (
          <input
            aria-label={`select-${row.ref}`}
            type="checkbox"
            checked={!!selected[row.id]}
            onChange={() => toggleSelect(row.id)}
          />
        ),
      },
      { key: "ref", label: "Ref", width: "w-28" },
      { key: "name", label: "Name" },
      { key: "mobile", label: "Mobile" },
      { key: "dueDate", label: "Due Date" },
      {
        key: "daysPast",
        label: "Days Past",
        render: (_: any, row: DueRow) => {
          const d = daysBetween(row.dueDate);
          return d === null ? "-" : d;
        },
        width: "w-24",
      },
      {
        key: "amount",
        label: "Amount",
        render: (_: any, row: DueRow) =>
          row.amount ? `₹${row.amount.toLocaleString()}` : "-",
      },
      {
        key: "status",
        label: "Status",
        render: (v: any) => (
          <span className="px-2 py-1 rounded bg-[var(--glass-01)] text-sm">
            {String(v ?? "-")}
          </span>
        ),
      },
      { key: "assignedTo", label: "Assigned", width: "w-32" },
      {
        key: "actions",
        label: "Action",
        width: "w-40",
        render: (_: any, row: DueRow) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => openView(row)}
            >
              View
            </Button>
            <Button size="sm" onClick={() => onRemind(row)}>
              Remind
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (!confirm("Escalate (mock)?")) return;
                alert("Escalated (mock)");
              }}
            >
              Escalate
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
      <h1 className="text-2xl font-bold">Payment Due Date</h1>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ref, name, mobile..."
              className="w-80"
            />
            <Input
              value={colMobile}
              onChange={(e) => setColMobile(e.target.value)}
              placeholder="Mobile column search"
              className="w-56"
            />
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              {TEMPLATES.map((t) => (
                <option key={t} value={t}>
                  {t}
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
                setTemplate("All");
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
              onClick={bulkRemind}
            >
              Send Reminders
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={bulkEscalate}
            >
              Escalate
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

      <DueDrawer viewing={viewing} close={closeView} onRemind={onRemind} />
    </div>
  );
}
