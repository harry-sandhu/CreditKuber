// src/pages/admin/Credit.tsx
import React, { useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";

/**
 * Admin Credit page — uses DataTable component
 *
 * Replace MOCK data with API calls (GET /admin/credit).
 * Use performDecision, performAssign to call your backend later.
 */

type CreditRow = {
  id: number;
  ref: string;
  name: string;
  mobile?: string;
  loanAmount: number;
  outstanding: number;
  apr?: number;
  status: "approved" | "rejected" | "under-review" | "disbursed" | string;
  branch?: string;
  creditOfficer?: string | null;
  lastCall?: string;
  score?: number;
};

const MOCK_CREDIT: CreditRow[] = [
  {
    id: 1,
    ref: "L-2001",
    name: "Ravi Kumar",
    mobile: "+91 9876543210",
    loanAmount: 50000,
    outstanding: 12000,
    apr: 14.5,
    status: "approved",
    branch: "Patiala",
    creditOfficer: "officer01",
    lastCall: "2025-09-01",
    score: 78,
  },
  {
    id: 2,
    ref: "L-2002",
    name: "Sunita Devi",
    mobile: "+91 9876500002",
    loanAmount: 75000,
    outstanding: 0,
    apr: 13.0,
    status: "disbursed",
    branch: "Ambala",
    creditOfficer: "officer02",
    lastCall: "2025-08-25",
    score: 92,
  },
  {
    id: 3,
    ref: "L-2003",
    name: "Aman Sharma",
    mobile: "+91 9876500003",
    loanAmount: 40000,
    outstanding: 16000,
    apr: 15.0,
    status: "under-review",
    branch: "Chandigarh",
    creditOfficer: null,
    lastCall: "2025-09-03",
    score: 64,
  },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function Credit() {
  const [rows, setRows] = useState<CreditRow[]>(MOCK_CREDIT);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [preset, setPreset] = useState<
    "All" | "approved" | "rejected" | "under-review" | "disbursed" | "high-risk"
  >("All");

  // columns for DataTable
  const columns = [
    { key: "ref", label: "Ref" },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    {
      key: "loanAmount",
      label: "Loan Amount",
      render: (v: any) => formatCurrency(Number(v ?? 0)),
    },
    {
      key: "outstanding",
      label: "Outstanding",
      render: (v: any) => formatCurrency(Number(v ?? 0)),
    },
    { key: "apr", label: "APR", render: (v: any) => (v ? `${v}%` : "-") },
    {
      key: "status",
      label: "Status",
      render: (v: any) => (
        <span className="px-2 py-1 rounded text-sm bg-[var(--glass-01)]">
          {String(v)}
        </span>
      ),
    },
    { key: "branch", label: "Branch" },
    { key: "creditOfficer", label: "Officer" },
    { key: "lastCall", label: "Last Call" },
    { key: "score", label: "Score" },
    {
      key: "actions",
      label: "Action",
      render: (_: any, row: CreditRow) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="btn-ghost"
            onClick={() => alert(`View ${row.ref} (mock)`)}
          >
            View
          </Button>
          <Button size="sm" onClick={() => handleApprove(row.id)}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleReject(row.id)}
          >
            Reject
          </Button>
        </div>
      ),
      width: "w-36",
    },
  ];

  // simple preset filtering implemented client-side
  const filteredRows = useMemo(() => {
    if (preset === "All") return rows;
    if (preset === "high-risk") return rows.filter((r) => (r.score ?? 0) < 65);
    return rows.filter((r) => r.status === preset);
  }, [rows, preset]);

  // these are mocked: replace with API calls
  async function handleApprove(id: number) {
    if (!confirm("Approve this loan (mock)?")) return;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    alert("Approved (mock)");
  }
  async function handleReject(id: number) {
    if (!confirm("Reject this loan (mock)?")) return;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    alert("Rejected (mock)");
  }

  function bulkAssignOfficer() {
    const ids = Object.keys(selectedIds)
      .filter((k) => selectedIds[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    // mock assign
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id) ? { ...r, creditOfficer: "bulkOfficer01" } : r
      )
    );
    setSelectedIds({});
    alert(`Assigned ${ids.length} rows to bulkOfficer01 (mock)`);
  }

  function onExportCsv(csv: string) {
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `credit_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Credit Report</h1>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as any)}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="All">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under-review">Under Review</option>
            <option value="disbursed">Disbursed</option>
            <option value="high-risk">High Risk (score &lt; 65)</option>
          </select>

          <Button size="sm" className="btn-ghost" onClick={bulkAssignOfficer}>
            Bulk assign officer
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredRows}
        idKey="id"
        selectable
        onExportCsv={onExportCsv}
      />
    </div>
  );
}
