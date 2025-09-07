// src/pages/admin/Reports.tsx
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Recharts for charts (available in your environment per project conventions)
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
} from "recharts";

/**
 * Reports page with a Portfolio Cut chart example added.
 * - Keeps your original UI/behavior (templates, run, export)
 * - Adds a Portfolio Cut visualization under Advanced Reports
 * - Uses MOCK_DATA (unchanged) and csvFromObjects
 */

// (Your TEMPLATES and MOCK_DATA are unchanged — keep them here)
type Template = {
  id: string;
  title: string;
  description?: string;
  advanced?: boolean;
};

const TEMPLATES: Template[] = [
  {
    id: "disbursed",
    title: "Disbursed Data",
    description: "All disbursal records (filterable by date/branch)",
  },
  {
    id: "collection",
    title: "Collection Data",
    description: "Collections and receipts",
  },
  {
    id: "cycle_datewise",
    title: "Cycle Data (datewise)",
    description: "Date-wise loan cycle info",
  },
  {
    id: "outstanding",
    title: "Outstanding Report",
    description: "Open outstanding by borrower/branch",
  },
  {
    id: "bad_debt",
    title: "Bad Debt Report",
    description: "Loans written off / NPA candidates",
  },
  {
    id: "loan",
    title: "Loan Report",
    description: "Loan-level details and lifecycle",
  },
  {
    id: "calling",
    title: "Calling Report",
    description: "Call logs, outcomes and follow-ups",
  },
  {
    id: "credit",
    title: "Credit Report",
    description: "Credit decisions and scores",
  },
  {
    id: "user_monthly",
    title: "User Monthly Target",
    description: "Targets and achievement by user",
  },
  {
    id: "city_monthly",
    title: "City Monthly Target",
    description: "Targets and achievement by city",
  },

  // advanced
  {
    id: "portfolio_cut",
    title: "Portfolio Cut",
    description: "Portfolio slices by bucket",
    advanced: true,
  },
  {
    id: "apr_report",
    title: "APR Report",
    description: "Interest/APR analytics",
    advanced: true,
  },
  {
    id: "collection_eff",
    title: "Collection Efficiency",
    description: "Collection KPIs vs targets",
    advanced: true,
  },
  {
    id: "business_snapshot",
    title: "Business Snapshot",
    description: "Executive summary",
    advanced: true,
  },
];

// -------------------- Mock datasets (unchanged) --------------------
const MOCK_DATA: Record<string, Record<string, any>[]> = {
  disbursed: [
    {
      ref: "D-1001",
      name: "Ravi Kumar",
      branch: "Patiala",
      amount: 50000,
      disbursedOn: "2025-08-20",
      officer: "officer01",
    },
    {
      ref: "D-1002",
      name: "Sunita Devi",
      branch: "Ambala",
      amount: 75000,
      disbursedOn: "2025-08-18",
      officer: "officer02",
    },
  ],
  collection: [
    {
      ref: "C-2001",
      borrower: "Aman Sharma",
      branch: "Chandigarh",
      amount: 3000,
      collectedOn: "2025-09-02",
      mode: "IMPS",
      collector: "collector01",
    },
    {
      ref: "C-2002",
      borrower: "Sunita Devi",
      branch: "Ambala",
      amount: 15000,
      collectedOn: "2025-08-25",
      mode: "NEFT",
      collector: "collector02",
    },
  ],
  cycle_datewise: [
    {
      ref: "L-1001",
      borrower: "Ravi Kumar",
      cycleStart: "2024-08-20",
      cycleEnd: "2025-08-19",
      cycles: 1,
    },
  ],
  outstanding: [
    {
      ref: "O-5001",
      name: "Mohan Lal",
      branch: "Patiala",
      outstanding: 18000,
      dueSince: "2025-06-12",
    },
  ],
  bad_debt: [
    {
      ref: "BD-9001",
      name: "Unknown",
      branch: "Chandigarh",
      amount: 40000,
      writtenOffOn: "2025-07-01",
    },
  ],
  calling: [
    {
      ref: "L-1001",
      borrower: "Ravi Kumar",
      callDate: "2025-09-05",
      outcome: "No Answer",
      calledBy: "caller01",
    },
    {
      ref: "L-1003",
      borrower: "Aman Sharma",
      callDate: "2025-09-04",
      outcome: "Interested",
      calledBy: "caller03",
    },
  ],
  credit: [
    {
      ref: "L-1001",
      name: "Ravi Kumar",
      score: 78,
      decision: "Approved",
      creditOfficer: "officer01",
    },
    {
      ref: "L-1003",
      name: "Aman Sharma",
      score: 64,
      decision: "Review",
      creditOfficer: "officer03",
    },
  ],
  user_monthly: [
    { user: "officer01", target: 20, achieved: 14 },
    { user: "collector01", target: 100000, achieved: 85000 },
  ],
  city_monthly: [
    { city: "Patiala", disbursed: 250000, collected: 180000 },
    { city: "Ambala", disbursed: 180000, collected: 120000 },
  ],
  portfolio_cut: [
    { bucket: "0-3 months", balance: 500000 },
    { bucket: "3-6 months", balance: 300000 },
    { bucket: "6-12 months", balance: 150000 },
    { bucket: "12+ months", balance: 60000 },
  ],
  apr_report: [
    { product: "Micro Loan", avgAPR: 14.2 },
    { product: "Agri Loan", avgAPR: 12.5 },
  ],
  collection_eff: [{ branch: "Patiala", target: 100000, collected: 92000 }],
  business_snapshot: [
    { metric: "AUM", value: 12500000 },
    { metric: "Active Loans", value: 324 },
  ],
};

// -------------------- Helpers --------------------
function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function csvFromObjects(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return [header, ...lines].join("\n");
}

// Small generic table for previewing returned dataset (unchanged)
function ResultTable({ rows }: { rows: Record<string, any>[] }) {
  if (!rows || rows.length === 0)
    return (
      <div className="text-sm text-[var(--color-muted)]">
        No data to display
      </div>
    );
  const keys = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k} className="p-3 text-left text-[var(--color-muted)]">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className="hover:bg-surface/40"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              {keys.map((k) => (
                <td key={k} className="p-3 text-[var(--color-text)]">
                  {typeof r[k] === "number"
                    ? k.toLowerCase().includes("amount") ||
                      k.toLowerCase().includes("disbursed") ||
                      k.toLowerCase().includes("collected") ||
                      k.toLowerCase().includes("outstanding") ||
                      k.toLowerCase().includes("value") ||
                      k.toLowerCase().includes("balance")
                      ? formatCurrency(r[k])
                      : r[k]
                    : String(r[k] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------- Page --------------------
export default function ReportsPage() {
  const [selected, setSelected] = useState<string | null>("disbursed");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [running, setRunning] = useState(false);

  // displayData contains the dataset returned for the last run
  const [displayData, setDisplayData] = useState<Record<string, any>[]>([]);

  const basicTemplates = useMemo(
    () => TEMPLATES.filter((t) => !t.advanced),
    []
  );
  const advancedTemplates = useMemo(
    () => TEMPLATES.filter((t) => t.advanced),
    []
  );

  async function runReport(templateId: string) {
    setRunning(true);
    try {
      // Replace with API call in future: const res = await api.post('/admin/reports/run', { templateId, from, to, branch });
      // setDisplayData(res.data.rows);
      await new Promise((r) => setTimeout(r, 400));
      const rows = MOCK_DATA[templateId] ?? [];
      setDisplayData(rows);
    } finally {
      setRunning(false);
    }
  }

  function exportCurrentCSV() {
    const csv = csvFromObjects(displayData);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selected ?? "report"}_${new Date().toISOString()}.csv`;
    link.click();
  }

  // ---------------- Portfolio Cut helpers (chart)
  const portfolioData = useMemo(() => {
    return (MOCK_DATA["portfolio_cut"] ?? []).map((r) => ({
      name: r.bucket,
      value: r.balance,
    }));
  }, []);

  const totalPortfolio = useMemo(
    () => portfolioData.reduce((s, p) => s + (p.value || 0), 0),
    [portfolioData]
  );

  const COLORS = ["#0a8f54", "#c9a635", "#a9c1a3", "#c02929", "#6b7280"];

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 bg-[var(--color-surface)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Monthly Disbursals
            </h2>
            <p className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
              ₹12,50,000
            </p>
            <div className="text-sm mt-2 text-[var(--color-muted)]">
              Generated: 2025-09-07 08:00
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-[var(--color-surface)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Monthly Collections
            </h2>
            <p className="mt-2 text-2xl font-bold text-[var(--color-success)]">
              ₹8,75,000
            </p>
            <div className="text-sm mt-2 text-[var(--color-muted)]">
              Generated: 2025-09-07 08:00
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm text-[var(--color-muted)]">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 rounded border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
          />
          <label className="text-sm ml-2 text-[var(--color-muted)]">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
          />

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-3 py-2 rounded border bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
          >
            <option value="">All branches</option>
            <option value="Patiala">Patiala</option>
            <option value="Ambala">Ambala</option>
            <option value="Chandigarh">Chandigarh</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="btn-ghost"
            onClick={() => {
              setFrom("");
              setTo("");
              setBranch("");
              setDisplayData([]);
            }}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (selected) runReport(selected);
            }}
            disabled={!selected || running}
          >
            {running ? "Running..." : "Run Report"}
          </Button>
        </div>
      </div>

      {/* Templates grid */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Prebuilt Templates
        </h2>
        <p className="text-sm text-[var(--color-muted)]">
          Pick a template and run it with the selected filters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {basicTemplates.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded ${
                selected === t.id
                  ? "bg-[var(--accent-grad)] text-[var(--inverse-text)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text)]"
              } border border-[var(--color-border)] shadow-[var(--shadow-soft)]`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div
                    className={`text-sm mt-1 ${
                      selected === t.id
                        ? "text-[rgba(255,255,255,0.85)]"
                        : "text-[var(--color-muted)]"
                    }`}
                  >
                    {t.description}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="px-3 py-1 border rounded btn-ghost"
                    onClick={() => {
                      const csv = csvFromObjects(MOCK_DATA[t.id] ?? []);
                      if (!csv) return alert("No data to export");
                      const blob = new Blob([csv], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = `${
                        t.id
                      }_sample_${new Date().toISOString()}.csv`;
                      link.click();
                    }}
                  >
                    Export
                  </button>

                  <button
                    className={`px-3 py-1 rounded ${
                      selected === t.id
                        ? "bg-[var(--inverse-text)] text-[var(--color-primary)]"
                        : "bg-[var(--color-primary)] text-[var(--inverse-text)]"
                    }`}
                    onClick={() => setSelected(t.id)}
                  >
                    {selected === t.id ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced reports */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Advanced Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {advancedTemplates.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--color-text)]">
                    {t.title}
                  </div>
                  <div className="text-sm mt-1 text-[var(--color-muted)]">
                    {t.description}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className="px-3 py-1 border rounded btn-ghost"
                    onClick={() => {
                      const csv = csvFromObjects(MOCK_DATA[t.id] ?? []);
                      if (!csv) return alert("No data to export");
                      const blob = new Blob([csv], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = `${
                        t.id
                      }_sample_${new Date().toISOString()}.csv`;
                      link.click();
                    }}
                  >
                    Export
                  </button>

                  {/* For portfolio_cut we also provide a 'Run' that loads into Results area */}
                  <button
                    className="px-3 py-1 rounded bg-[var(--accent-grad)] text-[var(--inverse-text)]"
                    onClick={() => runReport(t.id)}
                  >
                    Run
                  </button>
                </div>
              </div>

              {/* If this is portfolio_cut show a small preview on the card */}
              {t.id === "portfolio_cut" && (
                <div className="mt-4">
                  <div className="text-sm text-[var(--color-muted)] mb-2">
                    Preview
                  </div>
                  <div className="flex items-center gap-4">
                    <div style={{ width: 120, height: 100 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={MOCK_DATA.portfolio_cut}
                            dataKey="balance"
                            nameKey="bucket"
                            cx="50%"
                            cy="50%"
                            outerRadius={40}
                            innerRadius={20}
                            paddingAngle={2}
                          >
                            {MOCK_DATA.portfolio_cut.map(
                              (entry: any, idx: number) => (
                                <Cell
                                  key={entry.bucket}
                                  fill={COLORS[idx % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <ReTooltip
                            formatter={(value: any) => formatCurrency(value)}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Total</div>
                      <div className="text-lg font-bold">
                        {formatCurrency(totalPortfolio)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Results area */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Results
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => {
                setDisplayData([]);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={exportCurrentCSV}
              disabled={!displayData || displayData.length === 0}
            >
              Export Results
            </Button>
          </div>
        </div>

        <div>
          <ResultTable rows={displayData} />
        </div>

        {/* Portfolio Cut visualization area: show when selected or when displayData is portfolio_cut */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chart */}
          <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">Portfolio Cut</div>
                <div className="text-sm text-[var(--color-muted)]">
                  Bucket wise balances
                </div>
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                Total: {formatCurrency(totalPortfolio)}
              </div>
            </div>

            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    label={(entry: any) => `${entry.name}`}
                  >
                    {portfolioData.map((entry: any, idx: number) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value: any) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium">Portfolio Buckets</div>
              <div className="text-sm text-[var(--color-muted)]">
                Exportable
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 text-[var(--color-muted)]">Bucket</th>
                    <th className="p-2 text-[var(--color-muted)]">Balance</th>
                    <th className="p-2 text-[var(--color-muted)]">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((p, _i) => (
                    <tr
                      key={p.name}
                      className="hover:bg-surface/60 transition-colors"
                    >
                      <td className="p-2 text-[var(--color-text)]">{p.name}</td>
                      <td className="p-2 text-[var(--color-text)]">
                        {formatCurrency(p.value)}
                      </td>
                      <td className="p-2 text-[var(--color-muted)]">
                        {totalPortfolio
                          ? ((p.value / totalPortfolio) * 100).toFixed(1) + "%"
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => {
                  const csv = csvFromObjects(MOCK_DATA["portfolio_cut"] ?? []);
                  if (!csv) return alert("No data");
                  const blob = new Blob([csv], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `portfolio_cut_${new Date().toISOString()}.csv`;
                  link.click();
                }}
              >
                Export Portfolio CSV
              </Button>
              <Button size="sm" onClick={() => runReport("portfolio_cut")}>
                Run Portfolio Cut
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 p-4 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">
        <div className="text-sm text-[var(--color-muted)]">
          Tip: schedule heavy reports on the server (POST
          /api/admin/reports/schedule) and email results to users.
        </div>
      </div>
    </div>
  );
}
