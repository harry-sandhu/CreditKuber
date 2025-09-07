import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type PaymentRow = {
  id: number;
  ref?: string;
  borrower: string;
  amount: number;
  date: string; // ISO-ish (yyyy-mm-dd)
  mode?: string;
  branch?: string;
};

const INITIAL_PAYMENTS: PaymentRow[] = [
  {
    id: 1,
    ref: "P-3001",
    borrower: "John Doe",
    amount: 5000,
    date: "2025-08-15",
    mode: "NEFT",
    branch: "Patiala",
  },
  {
    id: 2,
    ref: "P-3002",
    borrower: "Jane Smith",
    amount: 3000,
    date: "2025-08-20",
    mode: "Cash",
    branch: "Chandigarh",
  },
  {
    id: 3,
    ref: "P-3003",
    borrower: "Aman Kumar",
    amount: 12000,
    date: "2025-09-02",
    mode: "IMPS",
    branch: "Ambala",
  },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function toISO(d?: string) {
  if (!d) return "";
  // handle yyyy-mm-dd or ISO inputs
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toISOString().split("T")[0];
}

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRow[]>(INITIAL_PAYMENTS);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // filters
  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return payments.filter((p) => {
      if (from) {
        const fromD = new Date(from);
        if (isNaN(fromD.getTime())) return false;
        if (new Date(p.date) < fromD) return false;
      }
      if (to) {
        const toD = new Date(to);
        if (isNaN(toD.getTime())) return false;
        // include whole day for 'to' by setting time to end of day
        toD.setHours(23, 59, 59, 999);
        if (new Date(p.date) > toD) return false;
      }
      if (!lower) return true;
      return [
        p.ref ?? "",
        p.borrower,
        p.mode ?? "",
        p.branch ?? "",
        String(p.amount),
      ].some((v) => v.toLowerCase().includes(lower));
    });
  }, [payments, q, from, to]);

  const totalAmount = useMemo(
    () => filtered.reduce((s, r) => s + r.amount, 0),
    [filtered]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function exportCSV() {
    const header = ["Ref", "Borrower", "Amount", "Date", "Mode", "Branch"].join(
      ","
    );
    const lines = filtered.map((r) =>
      [r.ref ?? "", r.borrower, r.amount, r.date, r.mode ?? "", r.branch ?? ""]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString()}.csv`;
    link.click();
  }

  // placeholder: mark refund / delete etc.
  function removePayment(id: number) {
    if (!confirm("Remove this payment?")) return;
    // TODO: call DELETE /api/admin/payments/:id
    setPayments((p) => p.filter((r) => r.id !== id));
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search ref, borrower, mode, branch, amount..."
            className="px-3 py-2 rounded border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <span style={{ color: "var(--color-muted)" }}>to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQ("");
              setFrom("");
              setTo("");
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
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-soft)",
          borderRadius: "var(--radius-md)",
        }}
        className="overflow-x-auto rounded"
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
                Borrower
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
                Date
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Mode
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Branch
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Actions
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
                  No payments found
                </td>
              </tr>
            )}

            {current.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-surface/40 transition-colors"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <td className="p-3">{p.ref ?? "-"}</td>
                <td className="p-3">{p.borrower}</td>
                <td className="p-3 text-right">{formatCurrency(p.amount)}</td>
                <td className="p-3">{toISO(p.date)}</td>
                <td className="p-3">{p.mode ?? "-"}</td>
                <td className="p-3">{p.branch ?? "-"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        alert("View payment - implement modal/API")
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removePayment(p.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* totals + pagination */}
      <div className="flex items-center justify-between">
        <div style={{ color: "var(--color-muted)" }}>
          <div className="text-sm">Total matching payments:</div>
          <div className="text-lg font-bold">
            {filtered.length} • {formatCurrency(totalAmount)}
          </div>
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
