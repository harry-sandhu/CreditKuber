// src/pages/admin/LoanReports.tsx
import { useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";

type LoanRow = {
  id: number;
  ref: string;
  borrower: string;
  product?: string;
  amount: number;
  tenureMonths: number;
  emi?: number;
  disbursedOn?: string;
  status?: "Active" | "Closed" | "Written Off" | "Under Review" | string;
  officer?: string;
  score?: number;
  outstanding?: number;
};

const MOCK_LOANS: LoanRow[] = [
  {
    id: 1,
    ref: "L-1001",
    borrower: "Ravi Kumar",
    product: "Micro Loan",
    amount: 50000,
    tenureMonths: 24,
    emi: 2415,
    disbursedOn: "2024-09-01",
    status: "Active",
    officer: "officer01",
    score: 78,
    outstanding: 12000,
  },
  {
    id: 2,
    ref: "L-1002",
    borrower: "Sunita Devi",
    product: "Micro Loan",
    amount: 75000,
    tenureMonths: 36,
    emi: 2582,
    disbursedOn: "2023-09-15",
    status: "Closed",
    officer: "officer02",
    score: 92,
    outstanding: 0,
  },
  {
    id: 3,
    ref: "L-1003",
    borrower: "Aman Sharma",
    product: "Agri Loan",
    amount: 40000,
    tenureMonths: 18,
    emi: 2425,
    disbursedOn: "2025-02-01",
    status: "Active",
    officer: "officer03",
    score: 64,
    outstanding: 16000,
  },
];

function csvFromRows(rows: LoanRow[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "borrower",
    "product",
    "amount",
    "tenureMonths",
    "emi",
    "disbursedOn",
    "status",
    "officer",
    "score",
    "outstanding",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function LoanReports() {
  const [rows, setRows] = useState<LoanRow[]>(MOCK_LOANS);
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (productFilter && r.product !== productFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (!lower) return true;
      return [r.ref, r.borrower, r.product, r.officer].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, query, productFilter, statusFilter]);

  function toggleSelect(id: number) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function exportFiltered() {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `loan_report_${new Date().toISOString()}.csv`;
    link.click();
  }

  function exportSelected() {
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
    link.download = `loan_report_selected_${new Date().toISOString()}.csv`;
    link.click();
  }

  function markRenewalOpportunity(id: number) {
    // mock: tag row with a note
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              officer: r.officer,
              notes: `${(r as any).notes ?? ""}\nRenewal suggested`,
            }
          : r
      )
    );
    alert("Marked renewal opportunity (mock)");
  }

  const columns = [
    {
      key: "select",
      label: "",
      render: (_: any, row: LoanRow) => (
        <input
          aria-label={`select-${row.ref}`}
          type="checkbox"
          checked={!!selected[row.id]}
          onChange={() => toggleSelect(row.id)}
        />
      ),
    },
    { key: "ref", label: "Ref" },
    { key: "borrower", label: "Borrower" },
    { key: "product", label: "Product" },
    {
      key: "amount",
      label: "Amount",
      render: (v: any) => (v ? formatCurrency(v) : "-"),
    },
    { key: "tenureMonths", label: "Tenure (m)" },
    {
      key: "emi",
      label: "EMI",
      render: (v: any) => (v ? formatCurrency(v) : "-"),
    },
    { key: "disbursedOn", label: "Disbursed On" },
    { key: "status", label: "Status" },
    { key: "officer", label: "Officer" },
    { key: "score", label: "Score" },
    {
      key: "outstanding",
      label: "Outstanding",
      render: (v: any) => (v ? formatCurrency(v) : "-"),
    },
    {
      key: "actions",
      label: "Action",
      render: (_: any, row: LoanRow) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="btn-ghost"
            onClick={() => alert(JSON.stringify(row, null, 2))}
          >
            View
          </Button>
          <Button size="sm" onClick={() => markRenewalOpportunity(row.id)}>
            Renewal
          </Button>
        </div>
      ),
    },
  ];

  // quick aggregates for top cards
  const totalLoans = rows.length;
  const activeLoans = rows.filter((r) => r.status === "Active").length;
  const outstandingTotal = rows.reduce((s, r) => s + (r.outstanding ?? 0), 0);

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Loan Reports</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
          <div className="text-sm text-[var(--color-muted)]">Total Loans</div>
          <div className="text-2xl font-bold text-[var(--color-text)]">
            {totalLoans}
          </div>
        </div>
        <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
          <div className="text-sm text-[var(--color-muted)]">Active Loans</div>
          <div className="text-2xl font-bold text-[var(--color-primary)]">
            {activeLoans}
          </div>
        </div>
        <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
          <div className="text-sm text-[var(--color-muted)]">Outstanding</div>
          <div className="text-2xl font-bold text-[var(--color-danger)]">
            {formatCurrency(outstandingTotal)}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ref, borrower, officer..."
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] w-80"
          />
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="">All products</option>
            {[...new Set(rows.map((r) => r.product).filter(Boolean))].map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              )
            )}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="">All status</option>
            {[...new Set(rows.map((r) => r.status).filter(Boolean))].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQuery("");
              setProductFilter("");
              setStatusFilter("");
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

      <DataTable
        columns={columns as any}
        rows={filtered as any}
        idKey="id"
        defaultPageSize={pageSize}
        showGlobalSearch={false}
        showPageSizeSelector={false}
      />
    </div>
  );
}
