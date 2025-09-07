import React, { useState } from "react";
import StatCard from "@/components/ui/statCard";
import { Button } from "@/components/ui/button";

type Loan = {
  ref: string;
  amount: number;
  tenure: number;
  outstanding: number;
  nextDue: string;
  status: "active" | "closed";
};

type Payment = {
  id: string;
  amount: number;
  date: string;
  mode: string;
};

const MOCK_LOANS: Loan[] = [
  {
    ref: "L-2001",
    amount: 50000,
    tenure: 12,
    outstanding: 18000,
    nextDue: "2025-09-15",
    status: "active",
  },
  {
    ref: "L-1999",
    amount: 30000,
    tenure: 10,
    outstanding: 0,
    nextDue: "-",
    status: "closed",
  },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: "P-501", amount: 5000, date: "2025-08-15", mode: "UPI" },
  { id: "P-502", amount: 5000, date: "2025-07-15", mode: "NEFT" },
];

function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function BorrowerDashboard() {
  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active");
  const outstandingTotal = activeLoans.reduce((s, l) => s + l.outstanding, 0);
  const nextDueDate = activeLoans.length > 0 ? activeLoans[0].nextDue : "-";

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Borrower Dashboard</h1>

      {/* Stat summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Active Loans"
          value={activeLoans.length}
          tone="primary"
          animated
        />
        <StatCard
          title="Outstanding Balance"
          value={outstandingTotal}
          tone="danger"
          animated
        />
        <StatCard title="Next Due Date" value={nextDueDate} tone="success" />
      </div>

      {/* Active loans table */}
      <section className="p-4 rounded border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold mb-3">My Loans</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-[var(--color-muted)]">
                <th className="p-2">Ref</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Tenure</th>
                <th className="p-2">Outstanding</th>
                <th className="p-2">Next Due</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOANS.map((l) => (
                <tr
                  key={l.ref}
                  className="hover:bg-surface/60 transition-colors"
                >
                  <td className="p-2">{l.ref}</td>
                  <td className="p-2">{formatCurrency(l.amount)}</td>
                  <td className="p-2">{l.tenure} mo</td>
                  <td className="p-2">{formatCurrency(l.outstanding)}</td>
                  <td className="p-2">{l.nextDue}</td>
                  <td className="p-2">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Repayment history */}
      <section className="p-4 rounded border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold mb-3">Recent Payments</h2>
        <ul className="space-y-2">
          {MOCK_PAYMENTS.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between p-2 rounded border border-[var(--color-border)]"
            >
              <div>
                <div className="font-medium">{formatCurrency(p.amount)}</div>
                <div className="text-sm text-[var(--color-muted)]">
                  {p.date} • {p.mode}
                </div>
              </div>
              <Button size="sm" onClick={() => alert(`View receipt ${p.id}`)}>
                Receipt
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <section className="p-4 rounded border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-soft)] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Need to repay?</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Make a payment towards your loan securely.
          </p>
        </div>
        <Button onClick={() => alert("Redirect to repayment page")}>
          Make Payment
        </Button>
      </section>
    </div>
  );
}
