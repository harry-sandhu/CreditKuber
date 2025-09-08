import React, { useMemo, useState } from "react";
import StatCard from "@/components/ui/statCard";

/**
 * Admin Dashboard — theme-token aware
 * Uses your provided CSS variables and helper classes (e.g. --color-*, .bg-accent, .text-inverse)
 * Changes made:
 * - Root containers use `var(--color-bg)` and `var(--color-text)` for reliable theme adherence
 * - Cards and tables use `var(--color-surface)` and other tokens for backgrounds, borders, and shadows
 * - Buttons reuse `.btn-ghost` and `.bg-accent` where appropriate
 * - Minimal inline styles keep Tailwind utility usage but ensure token-driven colors
 *
 * TODO:
 * - Replace mock data with real API calls
 * - Optionally split small components into `src/components/dashboard/*` files
 */

// -------------------- Types --------------------
type LoanRef = string;

type CreditRow = {
  ref: LoanRef;
  name: string;
  mobile?: string;
  loanAmount: number;
  outstanding: number;
  apr?: number;
  status?: "approved" | "rejected" | "under-review" | "disbursed" | string;
  branch?: string;
  creditOfficer?: string;
  lastCall?: string; // ISO
  score?: number;
};

type CallRow = {
  ref: LoanRef;
  borrower: string;
  mobile: string;
  callDate: string; // ISO
  outcome: string;
  calledBy: string;
  nextAction?: string;
  notes?: string;
};

// -------------------- Mock Data (replace with API) --------------------
const MOCK_CREDIT: CreditRow[] = [
  {
    ref: "L-1001",
    name: "Ravi Kumar",
    mobile: "9876500001",
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
    ref: "L-1002",
    name: "Sunita Devi",
    mobile: "9876500002",
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
    ref: "L-1003",
    name: "Aman Sharma",
    mobile: "9876500003",
    loanAmount: 40000,
    outstanding: 16000,
    apr: 15.0,
    status: "under-review",
    branch: "Chandigarh",
    creditOfficer: "officer03",
    lastCall: "2025-09-03",
    score: 64,
  },
  {
    ref: "L-1004",
    name: "Priya Singh",
    mobile: "9876500004",
    loanAmount: 60000,
    outstanding: 20000,
    apr: 12.5,
    status: "approved",
    branch: "Ludhiana",
    creditOfficer: "officer01",
    lastCall: "2025-08-29",
    score: 81,
  },
  {
    ref: "L-1005",
    name: "Mohit Verma",
    mobile: "9876500005",
    loanAmount: 90000,
    outstanding: 45000,
    apr: 14.0,
    status: "delayed",
    branch: "Jalandhar",
    creditOfficer: "officer02",
    lastCall: "2025-09-02",
    score: 55,
  },
  {
    ref: "L-1006",
    name: "Anjali Gupta",
    mobile: "9876500006",
    loanAmount: 30000,
    outstanding: 10000,
    apr: 13.5,
    status: "approved",
    branch: "Amritsar",
    creditOfficer: "officer03",
    lastCall: "2025-09-04",
    score: 73,
  },
  {
    ref: "L-1007",
    name: "Suresh Reddy",
    mobile: "9876500007",
    loanAmount: 120000,
    outstanding: 60000,
    apr: 15.2,
    status: "under-review",
    branch: "Patiala",
    creditOfficer: "officer01",
    lastCall: "2025-09-05",
    score: 69,
  },
  {
    ref: "L-1008",
    name: "Kiran Patel",
    mobile: "9876500008",
    loanAmount: 80000,
    outstanding: 20000,
    apr: 12.8,
    status: "approved",
    branch: "Ambala",
    creditOfficer: "officer02",
    lastCall: "2025-08-28",
    score: 85,
  },
  {
    ref: "L-1009",
    name: "Neha Yadav",
    mobile: "9876500009",
    loanAmount: 65000,
    outstanding: 65000,
    apr: 14.7,
    status: "pending",
    branch: "Chandigarh",
    creditOfficer: "officer03",
    lastCall: "2025-09-06",
    score: 59,
  },
  {
    ref: "L-1010",
    name: "Arjun Mehta",
    mobile: "9876500010",
    loanAmount: 55000,
    outstanding: 15000,
    apr: 13.2,
    status: "disbursed",
    branch: "Ludhiana",
    creditOfficer: "officer01",
    lastCall: "2025-09-07",
    score: 88,
  },
  {
    ref: "L-1011",
    name: "Rohit Jain",
    mobile: "9876500011",
    loanAmount: 70000,
    outstanding: 35000,
    apr: 14.3,
    status: "delayed",
    branch: "Jalandhar",
    creditOfficer: "officer02",
    lastCall: "2025-09-06",
    score: 62,
  },
  {
    ref: "L-1012",
    name: "Meena Kumari",
    mobile: "9876500012",
    loanAmount: 45000,
    outstanding: 5000,
    apr: 12.9,
    status: "approved",
    branch: "Amritsar",
    creditOfficer: "officer03",
    lastCall: "2025-08-30",
    score: 90,
  },
  {
    ref: "L-1013",
    name: "Deepak Joshi",
    mobile: "9876500013",
    loanAmount: 100000,
    outstanding: 80000,
    apr: 15.5,
    status: "pending",
    branch: "Patiala",
    creditOfficer: "officer01",
    lastCall: "2025-09-08",
    score: 58,
  },
  {
    ref: "L-1014",
    name: "Sneha Nair",
    mobile: "9876500014",
    loanAmount: 36000,
    outstanding: 12000,
    apr: 13.1,
    status: "disbursed",
    branch: "Ambala",
    creditOfficer: "officer02",
    lastCall: "2025-09-05",
    score: 83,
  },
  {
    ref: "L-1015",
    name: "Vikram Chauhan",
    mobile: "9876500015",
    loanAmount: 95000,
    outstanding: 95000,
    apr: 14.9,
    status: "under-review",
    branch: "Chandigarh",
    creditOfficer: "officer03",
    lastCall: "2025-09-07",
    score: 61,
  },
];

const MOCK_CALLS: CallRow[] = [
  {
    ref: "L-1001",
    borrower: "Ravi Kumar",
    mobile: "9876500001",
    callDate: "2025-09-05T10:00:00Z",
    outcome: "No Answer",
    calledBy: "caller01",
    nextAction: "Callback",
    notes: "Busy",
  },
  {
    ref: "L-1002",
    borrower: "Sunita Devi",
    mobile: "9876500002",
    callDate: "2025-09-05T11:00:00Z",
    outcome: "Payment Confirmed",
    calledBy: "caller02",
    notes: "RTGS done",
  },
  {
    ref: "L-1003",
    borrower: "Aman Sharma",
    mobile: "9876500003",
    callDate: "2025-09-04T09:30:00Z",
    outcome: "Interested in renewal",
    calledBy: "caller03",
    nextAction: "Create renewal case",
  },
  {
    ref: "L-1004",
    borrower: "Priya Singh",
    mobile: "9876500004",
    callDate: "2025-09-04T15:15:00Z",
    outcome: "Callback Requested",
    calledBy: "caller01",
    nextAction: "Schedule callback",
    notes: "Asked to call after 6 PM",
  },
  {
    ref: "L-1005",
    borrower: "Mohit Verma",
    mobile: "9876500005",
    callDate: "2025-09-03T14:20:00Z",
    outcome: "Not Interested",
    calledBy: "caller02",
    nextAction: "Close case",
    notes: "Not looking for renewal",
  },
  {
    ref: "L-1006",
    borrower: "Anjali Gupta",
    mobile: "9876500006",
    callDate: "2025-09-02T16:45:00Z",
    outcome: "Wrong Number",
    calledBy: "caller03",
    nextAction: "Verify details",
    notes: "Number not in use",
  },
  {
    ref: "L-1007",
    borrower: "Suresh Reddy",
    mobile: "9876500007",
    callDate: "2025-09-05T12:05:00Z",
    outcome: "Payment Pending",
    calledBy: "caller01",
    nextAction: "Follow-up",
    notes: "Promised to pay next week",
  },
  {
    ref: "L-1008",
    borrower: "Kiran Patel",
    mobile: "9876500008",
    callDate: "2025-09-06T09:10:00Z",
    outcome: "Payment Confirmed",
    calledBy: "caller02",
    notes: "UPI payment received",
  },
  {
    ref: "L-1009",
    borrower: "Neha Yadav",
    mobile: "9876500009",
    callDate: "2025-09-06T17:40:00Z",
    outcome: "Interested in top-up",
    calledBy: "caller03",
    nextAction: "Send proposal",
    notes: "Asked for higher loan amount",
  },
  {
    ref: "L-1010",
    borrower: "Arjun Mehta",
    mobile: "9876500010",
    callDate: "2025-09-07T13:25:00Z",
    outcome: "No Answer",
    calledBy: "caller01",
    nextAction: "Callback",
    notes: "Phone switched off",
  },
  {
    ref: "L-1011",
    borrower: "Rohit Jain",
    mobile: "9876500011",
    callDate: "2025-09-07T10:10:00Z",
    outcome: "Callback Requested",
    calledBy: "caller02",
    nextAction: "Schedule callback",
    notes: "Asked to call tomorrow morning",
  },
  {
    ref: "L-1012",
    borrower: "Meena Kumari",
    mobile: "9876500012",
    callDate: "2025-09-07T18:30:00Z",
    outcome: "Payment Pending",
    calledBy: "caller03",
    nextAction: "Follow-up",
    notes: "Partial payment made",
  },
  {
    ref: "L-1013",
    borrower: "Deepak Joshi",
    mobile: "9876500013",
    callDate: "2025-09-08T11:00:00Z",
    outcome: "Interested in renewal",
    calledBy: "caller01",
    nextAction: "Prepare renewal case",
    notes: "Needs faster processing",
  },
  {
    ref: "L-1014",
    borrower: "Sneha Nair",
    mobile: "9876500014",
    callDate: "2025-09-08T15:45:00Z",
    outcome: "Payment Confirmed",
    calledBy: "caller02",
    notes: "Cheque cleared",
  },
  {
    ref: "L-1015",
    borrower: "Vikram Chauhan",
    mobile: "9876500015",
    callDate: "2025-09-08T19:20:00Z",
    outcome: "Not Interested",
    calledBy: "caller03",
    nextAction: "Close case",
    notes: "Does not want loan renewal",
  },
];
// -------------------- Small Utilities --------------------
function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function isoDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleString();
}

// -------------------- Lightweight DataTable --------------------
function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  defaultPageSize = 10,
  idKey = "ref",
}: {
  columns: {
    key: keyof T | string;
    label: string;
    render?: (val: any, row: T) => React.ReactNode;
  }[];
  rows: T[];
  defaultPageSize?: number;
  idKey?: string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const lower = q.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [q, rows]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function exportCSV() {
    const header = columns.map((c) => c.label).join(",");
    const lines = current.map((r) =>
      columns
        .map((c) => {
          const key = c.key as string;
          const val = (r as any)[key];
          return '"' + String(val ?? "").replace(/"/g, '""') + '"';
        })
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search..."
            className="px-3 py-2 border rounded w-64"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              borderColor: "var(--color-border)",
            }}
          />
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={exportCSV}
          >
            Export CSV (page)
          </button>
        </div>
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          <div>Page size:</div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 border rounded"
            style={{
              background: "transparent",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded"
        style={{
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-soft)",
          border: "1px solid var(--color-border)",
        }}
      >
        <table className="min-w-full" style={{ color: "var(--color-text)" }}>
          <thead style={{ background: "var(--color-surface)" }}>
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className="px-4 py-2 text-left text-sm font-medium"
                  style={{ color: "var(--color-muted)" }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.map((r) => (
              <tr
                key={(r as any)[idKey] ?? Math.random()}
                className="hover:bg-slate-50"
              >
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className="px-4 py-3 text-sm align-top"
                    style={{ borderTop: "1px solid var(--color-border)" }}
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
        <div className="text-sm" style={{ color: "var(--color-muted)" }}>
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
          <div
            className="px-3 py-1 border rounded"
            style={{ color: "var(--color-muted)" }}
          >
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

// -------------------- Widgets --------------------
function CreditReportTable() {
  const [data] = useState<CreditRow[]>(MOCK_CREDIT);

  const columns = [
    { key: "ref", label: "Ref" },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    {
      key: "loanAmount",
      label: "Loan Amount",
      render: (v: any) => formatCurrency(v),
    },
    {
      key: "outstanding",
      label: "Outstanding",
      render: (v: any) => formatCurrency(v),
    },
    { key: "apr", label: "APR" },
    {
      key: "status",
      label: "Status",
      render: (v: any) => (
        <span
          className="text-sm px-2 py-1 rounded"
          style={{ background: "var(--glass-01)", color: "var(--color-text)" }}
        >
          {v}
        </span>
      ),
    },
    { key: "branch", label: "Branch" },
    { key: "creditOfficer", label: "Officer" },
    { key: "lastCall", label: "Last Call", render: (v: any) => isoDate(v) },
    { key: "score", label: "Score" },
  ];

  return (
    <div>
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        Credit Report
      </h3>
      <DataTable columns={columns} rows={data} />
    </div>
  );
}

function CallingReportTable() {
  const [data] = useState<CallRow[]>(MOCK_CALLS);

  const columns = [
    { key: "ref", label: "Ref" },
    { key: "borrower", label: "Borrower" },
    { key: "mobile", label: "Mobile" },
    { key: "callDate", label: "Call Date", render: (v: any) => isoDate(v) },
    { key: "outcome", label: "Outcome" },
    { key: "calledBy", label: "Called By" },
    { key: "nextAction", label: "Next Action" },
  ];

  return (
    <div>
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        Calling Report
      </h3>
      <DataTable columns={columns} rows={data} />
    </div>
  );
}

function LoanReportWidget() {
  const totalLoans = MOCK_CREDIT.length;
  const disbursed = MOCK_CREDIT.filter((r) => r.status === "disbursed").length;
  const approved = MOCK_CREDIT.filter((r) => r.status === "approved").length;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
      className="p-4"
    >
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        Loan Reports
      </h3>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <div
          className="p-3"
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--color-muted)" }}>
            Total loans
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {totalLoans}
          </div>
        </div>
        <div
          className="p-3"
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--color-muted)" }}>
            Disbursed
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {disbursed}
          </div>
        </div>
        <div
          className="p-3"
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--color-muted)" }}>
            Approved
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {approved}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <a
          href="/admin/reports"
          className="text-sm underline"
          style={{ color: "var(--color-text)" }}
        >
          Open Reports
        </a>
      </div>
    </div>
  );
}

function RenewalOpportunities() {
  const candidates = MOCK_CREDIT.filter((c) => c.score && c.score >= 70).slice(
    0,
    5
  );

  return (
    <div
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
      className="p-4"
    >
      <h3
        className="text-lg font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        Renewal Opportunities
      </h3>
      <ul className="space-y-2 mt-3">
        {candidates.map((c) => (
          <li
            key={c.ref}
            className="flex items-center justify-between p-2"
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div>
              <div
                className="font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {c.name} • {c.branch}
              </div>
              <div className="text-sm" style={{ color: "var(--color-muted)" }}>
                Outstanding: {formatCurrency(c.outstanding)} • Score: {c.score}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded btn-ghost">
                Contact
              </button>
              <button
                className="px-3 py-1 border rounded"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--inverse-text)",
                }}
              >
                Create Case
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaymentSummary() {
  const today = { leads: 12, disbursed: 2, collections: 32000, calls: 48 };
  const month = { leads: 220, disbursed: 45, collections: 850000, calls: 1300 };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
        className="p-4"
      >
        <h4 className="text-sm" style={{ color: "var(--color-muted)" }}>
          Today
        </h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="p-2">
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>
              New Leads
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              {today.leads}
            </div>
          </div>
          <div className="p-2">
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>
              Collections
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              {formatCurrency(today.collections)}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
        className="p-4"
      >
        <h4 className="text-sm" style={{ color: "var(--color-muted)" }}>
          Month to date
        </h4>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="p-2">
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>
              Disbursed
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              {month.disbursed}
            </div>
          </div>
          <div className="p-2">
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>
              Calls
            </div>
            <div
              className="font-bold text-lg"
              style={{ color: "var(--color-text)" }}
            >
              {month.calls}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
        className="p-4"
      >
        <h4 className="text-sm" style={{ color: "var(--color-muted)" }}>
          Date-wise
        </h4>
        <div className="mt-2 text-sm" style={{ color: "var(--color-text)" }}>
          Select a date range on Reports page for detailed view
        </div>
      </div>
    </div>
  );
}

// -------------------- Final Page --------------------
export default function AdminDashboard() {
  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <StatCard title="Total Loans" value={124} tone="primary" animated />
        </div>
        <div>
          <StatCard title="Active Users" value={356} tone="success" animated />
        </div>
        <div>
          <StatCard
            title="Pending Applications"
            value={18}
            tone="danger"
            animated
          />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div
            className="p-4"
            style={{
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-soft)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <CreditReportTable />
          </div>

          <div
            className="p-4"
            style={{
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-soft)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <CallingReportTable />
          </div>
        </div>

        <aside className="space-y-4">
          <LoanReportWidget />
          <RenewalOpportunities />
        </aside>
      </section>

      <section>
        <PaymentSummary />
      </section>

      <section
        className="p-4"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-lg font-semibold">Quick Links / Reports</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Disbursed Data",
            "Collection Data",
            "Cycle Data (datewise)",
            "Outstanding Report",
            "Bad Debt Report",
            "Loan Report",
            "Calling Report",
            "Credit Report",
            "User Monthly Target",
            "City Monthly Target",
            "Portfolio Cut",
            "APR Report",
            "Collection Efficiency",
            "Business Snapshot",
          ].map((t) => (
            <button
              key={t}
              className="px-3 py-1 border rounded text-sm btn-ghost"
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
