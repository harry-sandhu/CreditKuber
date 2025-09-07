import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Application = {
  id: number;
  ref?: string;
  name: string;
  amount: number;
  status: "Pending" | "Docs Requested" | "Approved" | "Rejected" | string;
  appliedAt?: string;
  city?: string;
  assignedTo?: string;
  notes?: string;
};

const MOCK: Application[] = [
  {
    id: 1,
    ref: "APP-1001",
    name: "Ravi Kumar",
    amount: 75000,
    status: "Pending",
    appliedAt: "2025-09-01",
    city: "Patiala",
  },
  {
    id: 2,
    ref: "APP-1002",
    name: "Anita Sharma",
    amount: 120000,
    status: "Pending",
    appliedAt: "2025-09-03",
    city: "Ambala",
  },
  {
    id: 3,
    ref: "APP-1003",
    name: "Sunita Devi",
    amount: 40000,
    status: "Docs Requested",
    appliedAt: "2025-08-25",
    city: "Chandigarh",
  },
];

const CREDIT_OFFICERS = [
  { id: "officer01", name: "Officer 1" },
  { id: "officer02", name: "Officer 2" },
  { id: "officer03", name: "Officer 3" },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function csvFromRows(rows: Application[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "name",
    "amount",
    "status",
    "appliedAt",
    "city",
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

export default function ReviewApplications() {
  const [rows, setRows] = useState<Application[]>(MOCK);
  const [query, setQuery] = useState("");
  const [colRef, setColRef] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | Application["status"] | "All"
  >("All");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // modals / inline forms
  const [requestDocs, setRequestDocs] = useState<{
    open: boolean;
    app?: Application;
    message: string;
  }>({ open: false, app: undefined, message: "" });
  const [decision, setDecision] = useState<{
    open: boolean;
    app?: Application;
    type?: "approve" | "reject";
    reason: string;
  }>({ open: false, app: undefined, type: undefined, reason: "" });
  const [assigning, setAssigning] = useState<{
    open: boolean;
    app?: Application;
    officer?: string;
  }>({ open: false, app: undefined, officer: undefined });

  // filtered
  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter && statusFilter !== "All" && r.status !== statusFilter)
        return false;
      if (
        colRef &&
        !String(r.ref ?? "")
          .toLowerCase()
          .includes(colRef.toLowerCase())
      )
        return false;
      if (!lower) return true;
      return [r.ref, r.name, r.city, r.status, String(r.amount)].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, query, colRef, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  // actions (mocked)
  async function performRequestDocs(app: Application, message: string) {
    setRequestDocs({ open: false, app: undefined, message: "" });
    // TODO: replace with your API call: await api.post('/api/officer/request-docs', { appId: app.id, message })
    await new Promise((r) => setTimeout(r, 500));
    setRows((prev) =>
      prev.map((p) =>
        p.id === app.id
          ? {
              ...p,
              status: "Docs Requested",
              notes: (p.notes ?? "") + `\nDocs requested: ${message}`,
            }
          : p
      )
    );
    alert(`Requested docs for ${app.name}`);
  }

  async function performDecision(
    app: Application,
    type: "approve" | "reject",
    reason?: string
  ) {
    setDecision({ open: false, app: undefined, type: undefined, reason: "" });
    // TODO: call your API: await api.post('/api/officer/decision', { appId: app.id, decision: type, reason })
    await new Promise((r) => setTimeout(r, 600));
    setRows((prev) =>
      prev.map((p) =>
        p.id === app.id
          ? {
              ...p,
              status: type === "approve" ? "Approved" : "Rejected",
              notes:
                (p.notes ?? "") +
                `\nDecision: ${type} ${reason ? "- " + reason : ""}`,
            }
          : p
      )
    );
    alert(`${type === "approve" ? "Approved" : "Rejected"} ${app.name}`);
  }

  async function performAssign(app: Application, officerId?: string) {
    setAssigning({ open: false, app: undefined, officer: undefined });
    if (!officerId) return;
    // TODO: api.patch('/api/officer/assign', { appId: app.id, officerId })
    await new Promise((r) => setTimeout(r, 400));
    setRows((prev) =>
      prev.map((p) => (p.id === app.id ? { ...p, assignedTo: officerId } : p))
    );
    alert(`Assigned to ${officerId}`);
  }

  function exportCSV() {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Review Loan Applications</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, ref, city..."
            className="w-64"
          />
          <Input
            value={colRef}
            onChange={(e) => {
              setColRef(e.target.value);
              setPage(0);
            }}
            placeholder="Ref column search"
            className="w-48"
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
            <option value="Pending">Pending</option>
            <option value="Docs Requested">Docs Requested</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQuery("");
              setColRef("");
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

      {/* Table */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                <th className="p-2 text-left text-[var(--color-muted)]">Ref</th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Applicant
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Amount
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Applied
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  City
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Status
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Assigned
                </th>
                <th className="p-2 text-left text-[var(--color-muted)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-[var(--color-muted)]"
                  >
                    No applications found
                  </td>
                </tr>
              )}

              {current.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-surface/60 transition-colors"
                >
                  <td className="p-2 text-[var(--color-text)]">
                    {app.ref ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">{app.name}</td>
                  <td className="p-2 text-[var(--color-text)]">
                    {formatCurrency(app.amount)}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {app.appliedAt ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {app.city ?? "-"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        app.status === "Pending"
                          ? "bg-[var(--glass-01)]"
                          : app.status === "Approved"
                          ? "bg-[var(--success)] text-[var(--inverse-text)]"
                          : app.status === "Rejected"
                          ? "bg-[var(--danger)] text-[var(--inverse-text)]"
                          : "bg-[var(--glass-01)]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {app.assignedTo ?? "-"}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() =>
                          setRequestDocs({
                            open: true,
                            app,
                            message: `Please upload the missing documents for ${app.name}`,
                          })
                        }
                      >
                        Request Docs
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          setDecision({
                            open: true,
                            app,
                            type: "approve",
                            reason: "",
                          })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setDecision({
                            open: true,
                            app,
                            type: "reject",
                            reason: "",
                          })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() =>
                          setAssigning({
                            open: true,
                            app,
                            officer: app.assignedTo,
                          })
                        }
                      >
                        Assign
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

      {/* Request Documents modal */}
      {requestDocs.open && requestDocs.app && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setRequestDocs({ open: false, app: undefined, message: "" })
            }
          ></div>
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Request Documents — {requestDocs.app.name}
            </h3>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              Message to borrower
            </p>
            <textarea
              value={requestDocs.message}
              onChange={(e) =>
                setRequestDocs((s) => ({ ...s, message: e.target.value }))
              }
              rows={5}
              className="w-full mt-2 rounded border p-2 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() =>
                  setRequestDocs({ open: false, app: undefined, message: "" })
                }
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  requestDocs.app &&
                  performRequestDocs(requestDocs.app, requestDocs.message)
                }
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decision modal */}
      {decision.open && decision.app && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setDecision({
                open: false,
                app: undefined,
                type: undefined,
                reason: "",
              })
            }
          ></div>
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              {decision.type === "approve" ? "Approve" : "Reject"} —{" "}
              {decision.app.name}
            </h3>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              Add reason (optional)
            </p>
            <textarea
              value={decision.reason}
              onChange={(e) =>
                setDecision((s) => ({ ...s, reason: e.target.value }))
              }
              rows={4}
              className="w-full mt-2 rounded border p-2 bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() =>
                  setDecision({
                    open: false,
                    app: undefined,
                    type: undefined,
                    reason: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  decision.app &&
                  decision.type &&
                  performDecision(decision.app, decision.type, decision.reason)
                }
              >
                {decision.type === "approve" ? "Approve" : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign modal */}
      {assigning.open && assigning.app && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setAssigning({ open: false, app: undefined, officer: undefined })
            }
          ></div>
          <div className="relative w-full max-w-sm p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Assign — {assigning.app.name}
            </h3>

            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Credit Officer
              </label>
              <select
                value={assigning.officer ?? ""}
                onChange={(e) =>
                  setAssigning((s) => ({ ...s, officer: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              >
                <option value="">Select officer</option>
                {CREDIT_OFFICERS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() =>
                  setAssigning({
                    open: false,
                    app: undefined,
                    officer: undefined,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  assigning.app &&
                  performAssign(assigning.app, assigning.officer)
                }
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
