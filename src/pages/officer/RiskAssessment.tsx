import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RiskRow = {
  id: number;
  ref?: string;
  name: string;
  score: number;
  risk: "Low" | "Medium" | "High" | "Unknown";
  city?: string;
  lastUpdated?: string;
  note?: string;
};

const MOCK: RiskRow[] = [
  {
    id: 1,
    ref: "L-1001",
    name: "Ravi Kumar",
    score: 720,
    risk: "Low",
    city: "Patiala",
    lastUpdated: "2025-09-05",
    note: "Stable income",
  },
  {
    id: 2,
    ref: "L-1002",
    name: "Anita Sharma",
    score: 590,
    risk: "High",
    city: "Ambala",
    lastUpdated: "2025-09-03",
    note: "Missed payments",
  },
  {
    id: 3,
    ref: "L-1003",
    name: "Aman Sharma",
    score: 660,
    risk: "Medium",
    city: "Chandigarh",
    lastUpdated: "2025-08-20",
    note: "Low score but salaried",
  },
  // add more rows for testing
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function riskBadgeClass(risk: RiskRow["risk"]) {
  switch (risk) {
    case "Low":
      return "inline-block px-2 py-1 rounded text-[var(--inverse-text)] bg-[var(--success)]";
    case "Medium":
      return "inline-block px-2 py-1 rounded text-[var(--inverse-text)] bg-[var(--warning)]";
    case "High":
      return "inline-block px-2 py-1 rounded text-[var(--inverse-text)] bg-[var(--danger)]";
    default:
      return "inline-block px-2 py-1 rounded bg-[var(--glass-01)] text-[var(--color-text)]";
  }
}

function csvFromRows(rows: RiskRow[]) {
  if (!rows.length) return "";
  const keys = ["ref", "name", "score", "risk", "city", "lastUpdated", "note"];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export default function RiskAssessment() {
  const [rows] = useState<RiskRow[]>(MOCK);
  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<"" | RiskRow["risk"] | "All">(
    "All"
  );
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<"score" | "name" | null>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [detail, setDetail] = useState<{ open: boolean; row?: RiskRow }>({
    open: false,
  });

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (riskFilter && riskFilter !== "All" && r.risk !== riskFilter)
        return false;
      if (!lower) return true;
      return [r.ref, r.name, r.city, r.note].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });

    if (sortKey) {
      out = out.slice().sort((a, b) => {
        const aV = (a as any)[sortKey];
        const bV = (b as any)[sortKey];
        if (aV == null && bV == null) return 0;
        if (aV == null) return 1;
        if (bV == null) return -1;
        if (typeof aV === "number")
          return sortDir === "asc" ? aV - bV : bV - aV;
        return sortDir === "asc"
          ? String(aV).localeCompare(String(bV))
          : String(bV).localeCompare(String(aV));
      });
    }

    return out;
  }, [rows, q, riskFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSort(key: "score" | "name") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "score" ? "desc" : "asc");
    }
  }

  function exportCSV() {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `risk_report_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Risk Assessment</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end">
        <div className="md:col-span-2">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, ref, city or note..."
            className="w-full"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="All">All risks</option>
            <option value="Low">Low risk</option>
            <option value="Medium">Medium risk</option>
            <option value="High">High risk</option>
            <option value="Unknown">Unknown</option>
          </select>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQ("");
              setRiskFilter("All");
              setPage(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 bg-[var(--color-surface)]">
            <div className="text-sm text-[var(--color-muted)]">
              Total reviewed
            </div>
            <div className="text-xl font-bold text-[var(--color-text)]">
              {rows.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-[var(--color-surface)]">
            <div className="text-sm text-[var(--color-muted)]">High risk</div>
            <div className="text-xl font-bold text-[var(--danger)]">
              {rows.filter((r) => r.risk === "High").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-[var(--color-surface)]">
            <div className="text-sm text-[var(--color-muted)]">Low risk</div>
            <div className="text-xl font-bold text-[var(--success)]">
              {rows.filter((r) => r.risk === "Low").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table header actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => toggleSort("score")}
          >
            Sort by score{" "}
            {sortKey === "score" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => toggleSort("name")}
          >
            Sort by name{" "}
            {sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={exportCSV}
          >
            Export CSV
          </button>
        </div>

        <div className="text-sm text-[var(--color-muted)]">
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1} -{" "}
          {Math.min(filtered.length, (page + 1) * pageSize)} of{" "}
          {filtered.length}
        </div>
      </div>

      {/* Rows list (compact table) */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="text-left">
              <th className="p-2 text-[var(--color-muted)]">Ref</th>
              <th className="p-2 text-[var(--color-muted)]">Name</th>
              <th className="p-2 text-[var(--color-muted)]">City</th>
              <th className="p-2 text-[var(--color-muted)]">Score</th>
              <th className="p-2 text-[var(--color-muted)]">Risk</th>
              <th className="p-2 text-[var(--color-muted)]">Updated</th>
              <th className="p-2 text-[var(--color-muted)]">Action</th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-[var(--color-muted)]"
                >
                  No items
                </td>
              </tr>
            )}

            {current.map((r) => (
              <tr key={r.id} className="hover:bg-surface/60 transition-colors">
                <td className="p-2 text-[var(--color-text)]">{r.ref ?? "-"}</td>
                <td className="p-2 text-[var(--color-text)]">{r.name}</td>
                <td className="p-2 text-[var(--color-text)]">
                  {r.city ?? "-"}
                </td>
                <td className="p-2 text-[var(--color-text)]">{r.score}</td>
                <td className="p-2">
                  <span className={riskBadgeClass(r.risk)}>{r.risk}</span>
                </td>
                <td className="p-2 text-[var(--color-muted)] text-sm">
                  {r.lastUpdated ?? "-"}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="btn-ghost"
                      onClick={() => setDetail({ open: true, row: r })}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => alert(`Create action for ${r.name}`)}
                    >
                      Action
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
            Page: {page + 1} / {pageCount}
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

      {/* detail drawer/modal */}
      {detail.open && detail.row && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDetail({ open: false })}
          ></div>
          <div className="relative w-full max-w-lg h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">
                Risk Details — {detail.row.name}
              </h3>
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setDetail({ open: false })}
              >
                Close
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-sm text-[var(--color-muted)]">Ref</div>
              <div className="font-medium">{detail.row.ref}</div>

              <div className="text-sm text-[var(--color-muted)]">Score</div>
              <div className="font-bold text-[var(--color-text)]">
                {detail.row.score}
              </div>

              <div className="text-sm text-[var(--color-muted)]">
                Risk Level
              </div>
              <div>
                <span className={riskBadgeClass(detail.row.risk)}>
                  {detail.row.risk}
                </span>
              </div>

              <div className="text-sm text-[var(--color-muted)]">Notes</div>
              <div className="text-sm">{detail.row.note ?? "-"}</div>

              <div className="text-sm text-[var(--color-muted)]">
                Last Updated
              </div>
              <div className="text-sm">{detail.row.lastUpdated ?? "-"}</div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Recent activity</h4>
                <ul className="mt-2 space-y-2 text-sm text-[var(--color-text)]">
                  <li>2025-09-05 — Score updated by scoring engine</li>
                  <li>2025-08-20 — Payment behavior: on-time</li>
                  <li>2025-07-10 — Soft pull credit check</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  onClick={() => alert("Open borrower profile (implement)")}
                >
                  Open Profile
                </Button>
                <Button
                  className="btn-ghost"
                  onClick={() =>
                    alert("Create intervention / assign to collections")
                  }
                >
                  Create Intervention
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
