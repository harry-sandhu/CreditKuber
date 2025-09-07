// src/pages/admin/Disbursal.tsx
import React, { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DisbursalRow = {
  id: number;
  ref: string;
  name: string;
  loanRequired?: number;
  loanApproved?: number | null;
  monthlyIncome?: number;
  status?: "Required" | "Approved" | "Disbursed" | "Failed" | string;
  disbursedAt?: string | null; // ISO
  ipAddress?: string;
  branch?: string;
  assignedTo?: string | null;
};

const PRESETS = ["All", "Required", "Approved", "Disbursed", "Failed"] as const;

const MOCK: DisbursalRow[] = [
  {
    id: 1,
    ref: "D-3001",
    name: "Ravi Kumar",
    loanRequired: 50000,
    loanApproved: 45000,
    monthlyIncome: 42000,
    status: "Approved",
    disbursedAt: null,
    ipAddress: "103.21.45.12",
    branch: "Patiala",
    assignedTo: "ops01",
  },
  {
    id: 2,
    ref: "D-3002",
    name: "Anita Sharma",
    loanRequired: 30000,
    loanApproved: 30000,
    monthlyIncome: 25000,
    status: "Disbursed",
    disbursedAt: "2025-08-20",
    ipAddress: "103.21.45.55",
    branch: "Ambala",
    assignedTo: "ops02",
  },
  {
    id: 3,
    ref: "D-3003",
    name: "Sunita Devi",
    loanRequired: 25000,
    loanApproved: null,
    monthlyIncome: 18000,
    status: "Required",
    disbursedAt: null,
    ipAddress: "103.21.45.99",
    branch: "Chandigarh",
    assignedTo: null,
  },
];

function csvFromRows(rows: DisbursalRow[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "name",
    "loanRequired",
    "loanApproved",
    "monthlyIncome",
    "status",
    "disbursedAt",
    "ipAddress",
    "branch",
    "assignedTo",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

/* ---------------- Disbursal Drawer ---------------- */
function DisbursalDrawer({
  viewing,
  close,
  openMark,
}: {
  viewing: { open: boolean; row?: DisbursalRow };
  close: () => void;
  openMark: (row: DisbursalRow) => void;
}) {
  if (!viewing.open || !viewing.row) return null;
  const r = viewing.row;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full max-w-md h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Disbursal — {r.ref}</h3>
          <Button size="sm" className="btn-ghost" onClick={close}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <strong>Name:</strong> {r.name}
          </div>
          <div>
            <strong>Loan Required:</strong>{" "}
            {r.loanRequired ? `₹${r.loanRequired.toLocaleString()}` : "-"}
          </div>
          <div>
            <strong>Loan Approved:</strong>{" "}
            {r.loanApproved
              ? `₹${r.loanApproved.toLocaleString()}`
              : r.loanApproved === null
              ? "-"
              : "-"}
          </div>
          <div>
            <strong>Monthly Income:</strong>{" "}
            {r.monthlyIncome ? `₹${r.monthlyIncome.toLocaleString()}` : "-"}
          </div>
          <div>
            <strong>Status:</strong> {r.status}
          </div>
          <div>
            <strong>Disbursed At:</strong> {r.disbursedAt ?? "-"}
          </div>
          <div>
            <strong>IP:</strong> {r.ipAddress ?? "-"}
          </div>
          <div>
            <strong>Branch:</strong> {r.branch ?? "-"}
          </div>
          <div>
            <strong>Assigned:</strong> {r.assignedTo ?? "-"}
          </div>

          <div className="mt-4 flex gap-2">
            {r.status !== "Disbursed" && (
              <Button size="sm" onClick={() => openMark(r)}>
                Mark Disbursed
              </Button>
            )}
            {r.status === "Disbursed" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("Revert disbursal (mock)?")) return;
                  /* TODO: API */ alert("Reverted (mock)");
                }}
              >
                Revert
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */
export default function Disbursal() {
  const [rows, setRows] = useState<DisbursalRow[]>(MOCK);
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("All");
  const [query, setQuery] = useState("");
  const [colIP, setColIP] = useState("");
  const [fromDate, setFromDate] = useState<string | "">("");
  const [toDate, setToDate] = useState<string | "">("");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(10);

  // UI: drawer + mark modal
  const [viewing, setViewing] = useState<{ open: boolean; row?: DisbursalRow }>(
    { open: false }
  );
  const [marking, setMarking] = useState<{
    open: boolean;
    row?: DisbursalRow;
    date?: string;
  }>({ open: false });

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (preset !== "All" && r.status !== preset) return false;
      if (colIP && !(r.ipAddress ?? "").includes(colIP)) return false;
      if (fromDate) {
        const from = new Date(fromDate);
        const d = r.disbursedAt ? new Date(r.disbursedAt) : null;
        if (!d || d < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        const d = r.disbursedAt ? new Date(r.disbursedAt) : null;
        if (!d || d > to) return false;
      }
      if (!lower) return true;
      return [r.ref, r.name, r.branch, r.ipAddress, r.assignedTo].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, preset, query, colIP, fromDate, toDate]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  function toggleSelect(id: number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }
  function selectAllOnPage(ids: number[], checked: boolean) {
    setSelected((s) => {
      const copy = { ...s };
      ids.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }

  const exportFiltered = useCallback(() => {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `disbursal_${new Date().toISOString()}.csv`;
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
    link.download = `disbursal_selected_${new Date().toISOString()}.csv`;
    link.click();
  }, [selected, rows]);

  // mark disbursed mock
  async function openMark(r: DisbursalRow) {
    setMarking({
      open: true,
      row: r,
      date: new Date().toISOString().slice(0, 10),
    });
  }
  async function performMarkDisbursed(rowId?: number, date?: string) {
    setMarking({ open: false });
    if (!rowId || !date) return;
    // TODO: call API to mark
    await new Promise((r) => setTimeout(r, 300));
    setRows((prev) =>
      prev.map((p) =>
        p.id === rowId ? { ...p, status: "Disbursed", disbursedAt: date } : p
      )
    );
    alert(`Marked ${rowId} as Disbursed on ${date} (mock)`);
  }

  function openView(row: DisbursalRow) {
    setViewing({ open: true, row });
  }
  function closeView() {
    setViewing({ open: false, row: undefined });
  }

  function bulkMarkDisbursed() {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    if (!confirm(`Mark ${ids.length} rows as disbursed (mock)?`)) return;
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: "Disbursed",
              disbursedAt: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );
    setSelected({});
    alert(`Marked ${ids.length} rows as Disbursed (mock)`);
  }

  // DataTable columns
  const columns = useMemo(
    () => [
      {
        key: "select",
        label: "",
        width: "w-12",
        render: (_: any, row: DisbursalRow) => (
          <input
            type="checkbox"
            aria-label={`select-${row.ref}`}
            checked={!!selected[row.id]}
            onChange={() => toggleSelect(row.id)}
          />
        ),
      },
      { key: "ref", label: "Ref", width: "w-28" },
      { key: "name", label: "Name" },
      {
        key: "loanRequired",
        label: "Required",
        render: (v: any) => (v ? `₹${Number(v).toLocaleString()}` : "-"),
      },
      {
        key: "loanApproved",
        label: "Approved",
        render: (v: any) => (v ? `₹${Number(v).toLocaleString()}` : "-"),
      },
      {
        key: "monthlyIncome",
        label: "Monthly Income",
        render: (v: any) => (v ? `₹${Number(v).toLocaleString()}` : "-"),
      },
      { key: "status", label: "Status" },
      { key: "disbursedAt", label: "Disbursed At" },
      { key: "ipAddress", label: "IP" },
      { key: "branch", label: "Branch" },
      { key: "assignedTo", label: "Assigned" },
      {
        key: "actions",
        label: "Action",
        width: "w-44",
        render: (_: any, row: DisbursalRow) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => openView(row)}
            >
              View
            </Button>
            {row.status !== "Disbursed" ? (
              <Button size="sm" onClick={() => openMark(row)}>
                Mark Disbursed
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (!confirm("Revert disbursal (mock)?")) return;
                  setRows((prev) =>
                    prev.map((p) =>
                      p.id === row.id
                        ? { ...p, status: "Approved", disbursedAt: null }
                        : p
                    )
                  );
                  alert("Reverted (mock)");
                }}
              >
                Revert
              </Button>
            )}
          </div>
        ),
      },
    ],
    [selected]
  );

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Disbursal</h1>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ref, name, branch, IP..."
              className="w-80"
            />
            <Input
              value={colIP}
              onChange={(e) => setColIP(e.target.value)}
              placeholder="IP column search"
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
                setColIP("");
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
              onClick={bulkMarkDisbursed}
            >
              Bulk mark disbursed
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

      {/* Mark Disbursed modal */}
      {marking.open && marking.row && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMarking({ open: false })}
          ></div>
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Mark Disbursed — {marking.row.ref}
            </h3>

            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Disbursed date
              </label>
              <input
                type="date"
                value={marking.date ?? ""}
                onChange={(e) =>
                  setMarking((s) => ({ ...s, date: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setMarking({ open: false })}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  performMarkDisbursed(marking.row?.id, marking.date)
                }
              >
                Mark
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View drawer */}
      <DisbursalDrawer
        viewing={viewing}
        close={closeView}
        openMark={(r) => openMark(r)}
      />
    </div>
  );
}
