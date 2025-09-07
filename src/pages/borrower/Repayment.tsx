import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NextDue = {
  loanId: string | number;
  outstanding: number;
  dueDate: string; // display string
  minDue?: number; // min instalment
};

const MOCK_NEXT_DUE: NextDue = {
  loanId: "L-2001",
  outstanding: 5000,
  dueDate: "15 Sep 2025",
  minDue: 5000,
};

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function Repayment() {
  // Replace this mock with an API fetch on mount when wiring to backend
  const [nextDue] = useState<NextDue>(MOCK_NEXT_DUE);

  // payment form
  const [amount, setAmount] = useState<number | "">(nextDue.outstanding);
  const [mode, setMode] = useState<"UPI" | "NEFT" | "IMPS" | "Cash">("UPI");
  const [txn, setTxn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Record<string, any> | null>(null);

  const isFullPay = useMemo(
    () => typeof amount === "number" && amount >= nextDue.outstanding,
    [amount, nextDue]
  );

  function validate() {
    setError(null);
    if (amount === "" || typeof amount !== "number" || isNaN(amount)) {
      setError("Enter a valid amount.");
      return false;
    }
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return false;
    }
    if (amount > nextDue.outstanding) {
      setError("Amount cannot exceed outstanding balance.");
      return false;
    }
    if ((mode === "NEFT" || mode === "IMPS") && txn.trim().length < 3) {
      setError("Enter a valid transaction reference for bank transfers.");
      return false;
    }
    return true;
  }

  async function handlePay(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage(null);
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Replace with actual API:
      // const res = await api.post('/api/borrower/payments', { loanId: nextDue.loanId, amount, mode, txn });
      await new Promise((r) => setTimeout(r, 900)); // simulate network

      const receiptObj = {
        receiptId: `RCPT-${Date.now()}`,
        loanId: nextDue.loanId,
        amount,
        mode,
        txn: txn || "-",
        paidAt: new Date().toISOString(),
      };

      setReceipt(receiptObj);
      setMessage("Payment successful. Receipt generated.");
      // Ideally refresh outstanding from server; here we set to outstanding - amount for UX.
      // In production, refresh via GET /api/borrower/loans or similar.
      // For now, keep nextDue as-is (mock).
    } catch (err) {
      console.error(err);
      setError("Payment failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadReceiptCSV() {
    if (!receipt) return;
    const keys = Object.keys(receipt);
    const header = keys.join(",");
    const line = keys
      .map((k) => `"${String(receipt[k] ?? "").replace(/"/g, '""')}"`)
      .join(",");
    const csv = [header, line].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${receipt.receiptId}.csv`;
    link.click();
  }

  return (
    <div
      className="max-w-lg space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Loan Repayment</h1>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
        <p className="text-lg font-semibold text-[var(--color-text)]">
          Loan #{nextDue.loanId}
        </p>

        <div className="mt-3">
          <div className="text-sm text-[var(--color-muted)]">Outstanding</div>
          <div className="text-2xl font-bold">
            {formatCurrency(nextDue.outstanding)}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-sm text-[var(--color-muted)]">Due Date</div>
          <div className="text-md font-medium text-[var(--success)]">
            {nextDue.dueDate}
          </div>
        </div>

        <form onSubmit={handlePay} className="mt-4 space-y-3">
          <label className="block text-sm text-[var(--color-muted)]">
            Payment Amount
          </label>
          <Input
            type="number"
            value={amount === "" ? "" : String(amount)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value;
              setAmount(v === "" ? "" : Number(v));
            }}
            placeholder={`${nextDue.outstanding}`}
            className="w-full"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded border ${
                isFullPay
                  ? "bg-[var(--color-primary)] text-[var(--inverse-text)]"
                  : "btn-ghost"
              }`}
              onClick={() => setAmount(nextDue.outstanding)}
            >
              Pay Full
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded border ${
                !isFullPay
                  ? "bg-[var(--color-secondary)] text-[var(--inverse-text)]"
                  : "btn-ghost"
              }`}
              onClick={() =>
                setAmount(nextDue.minDue ?? Math.min(1000, nextDue.outstanding))
              }
            >
              Pay Min
            </button>
          </div>

          <div>
            <label className="block text-sm text-[var(--color-muted)]">
              Payment Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="px-3 py-2 mt-1 rounded border bg-[var(--color-bg)]"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <option value="UPI">UPI</option>
              <option value="NEFT">NEFT</option>
              <option value="IMPS">IMPS</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {(mode === "NEFT" || mode === "IMPS") && (
            <div>
              <label className="block text-sm text-[var(--color-muted)]">
                Bank Transaction / Reference
              </label>
              <Input
                value={txn}
                onChange={(e) => setTxn(e.target.value)}
                placeholder="Enter bank txn ref"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Processing..."
                : `Pay ${formatCurrency(
                    typeof amount === "number" ? amount : 0
                  )}`}
            </Button>

            <Button
              type="button"
              className="w-full btn-ghost"
              onClick={() => {
                setAmount(nextDue.outstanding);
                setMode("UPI");
                setTxn("");
                setMessage(null);
                setError(null);
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-3 text-sm text-[var(--danger)]">{error}</div>
        )}
        {message && (
          <div className="mt-3 text-sm text-[var(--success)]">{message}</div>
        )}

        {receipt && (
          <div className="mt-4 p-3 border border-[var(--color-border)] rounded bg-[var(--color-surface)]">
            <div className="text-sm text-[var(--color-muted)]">Receipt</div>
            <div className="font-medium">{receipt.receiptId}</div>
            <div className="text-sm text-[var(--color-muted)]">
              Paid: {new Date(receipt.paidAt).toLocaleString()}
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={downloadReceiptCSV}>
                Download Receipt
              </Button>
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => alert("Open receipt view (implement modal/pdf)")}
              >
                View
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
