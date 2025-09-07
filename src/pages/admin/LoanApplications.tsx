import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Application = {
  id: number;
  ref: string;
  name: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  appliedAt?: string;
  mobile?: string;
};

const INITIAL: Application[] = [
  {
    id: 1,
    ref: "APP-1001",
    name: "John Doe",
    amount: 50000,
    status: "Pending",
    appliedAt: "2025-09-01",
    mobile: "9876500001",
  },
  {
    id: 2,
    ref: "APP-1002",
    name: "Jane Smith",
    amount: 30000,
    status: "Approved",
    appliedAt: "2025-08-25",
    mobile: "9876500002",
  },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function LoanApplications() {
  const [applications, setApplications] = useState<Application[]>(INITIAL);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Application["status"]>(
    ""
  );
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // search + filter
  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusFilter && a.status !== statusFilter) return false;
      if (!lower) return true;
      return [a.ref, a.name, String(a.amount), a.mobile ?? "", a.status].some(
        (v) => v?.toLowerCase().includes(lower)
      );
    });
  }, [applications, q, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function approve(id: number) {
    // replace with API call: POST /api/admin/loan/:id/approve
    if (!window.confirm("Approve this application?")) return;
    setApplications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  }

  function reject(id: number) {
    // replace with API call: POST /api/admin/loan/:id/reject
    if (!window.confirm("Reject this application?")) return;
    setApplications((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
  }

  function exportCSV() {
    const header = [
      "Ref",
      "Name",
      "Amount",
      "Status",
      "Applied At",
      "Mobile",
    ].join(",");
    const lines = filtered.map((r) =>
      [r.ref, r.name, r.amount, r.status, r.appliedAt ?? "", r.mobile ?? ""]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `loan_applications_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loan Applications</h1>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search ref, name, mobile, amount..."
            className="px-3 py-2 rounded border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-3 py-2 rounded border"
            style={{
              background: "transparent",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQ("");
              setStatusFilter("");
              setPage(0);
            }}
          >
            Reset
          </button>

          <Button size="sm" onClick={exportCSV}>
            Export
          </Button>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Ref
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Applicant
              </th>
              <th
                className="p-3 text-right"
                style={{ color: "var(--color-muted)" }}
              >
                Amount
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Applied
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Mobile
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Status
              </th>
              <th className="p-3" style={{ color: "var(--color-muted)" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center"
                  style={{ color: "var(--color-muted)" }}
                >
                  No applications found
                </td>
              </tr>
            )}

            {current.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-surface/40 transition-colors"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <td className="p-3">{app.ref}</td>
                <td className="p-3">{app.name}</td>
                <td className="p-3 text-right">{formatCurrency(app.amount)}</td>
                <td className="p-3">{app.appliedAt ?? "-"}</td>
                <td className="p-3">{app.mobile ?? "-"}</td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 text-sm rounded"
                    style={{
                      background:
                        app.status === "Pending"
                          ? "var(--glass-01)"
                          : app.status === "Approved"
                          ? "rgba(10,143,84,0.08)"
                          : "rgba(192,41,41,0.08)",
                      color: "var(--color-text)",
                    }}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => approve(app.id)}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => reject(app.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between">
        <div style={{ color: "var(--color-muted)" }}>
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1} -{" "}
          {Math.min(filtered.length, (page + 1) * pageSize)} of{" "}
          {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <div style={{ color: "var(--color-muted)" }}>Page size:</div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 rounded border"
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
