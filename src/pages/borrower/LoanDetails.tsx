import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Loan = {
  id: number | string;
  amount: number;
  status: "Active" | "Closed" | string;
  balance: number;
  product?: string;
  startDate?: string;
};

type ScheduleRow = {
  instalment: number;
  dueDate: string;
  amount: number;
  paid?: boolean;
};

const MOCK_LOANS: Loan[] = [
  {
    id: "L-2001",
    amount: 20000,
    status: "Active",
    balance: 12000,
    product: "Micro Loan",
    startDate: "2024-09-01",
  },
  {
    id: "L-1999",
    amount: 15000,
    status: "Closed",
    balance: 0,
    product: "Personal Loan",
    startDate: "2023-03-01",
  },
];

const MOCK_SCHEDULES: Record<string, ScheduleRow[]> = {
  "L-2001": [
    { instalment: 1, dueDate: "2024-10-15", amount: 2000, paid: true },
    { instalment: 2, dueDate: "2024-11-15", amount: 2000, paid: true },
    { instalment: 3, dueDate: "2024-12-15", amount: 2000, paid: true },
    { instalment: 4, dueDate: "2025-01-15", amount: 2000, paid: true },
    { instalment: 5, dueDate: "2025-02-15", amount: 2000, paid: true },
    { instalment: 6, dueDate: "2025-03-15", amount: 2000, paid: false },
  ],
  "L-1999": [
    { instalment: 1, dueDate: "2023-04-10", amount: 1500, paid: true },
    { instalment: 2, dueDate: "2023-05-10", amount: 1500, paid: true },
  ],
};

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

export default function LoanDetails() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loans] = useState<Loan[]>(MOCK_LOANS);

  function toggleSchedule(loanId: string | number) {
    setExpanded((s) => ({ ...s, [String(loanId)]: !s[String(loanId)] }));
  }

  function downloadSchedule(loanId: string | number) {
    const rows = MOCK_SCHEDULES[String(loanId)] ?? [];
    const csv = csvFromObjects(rows);
    if (!csv) return alert("No schedule available to download.");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `schedule_${loanId}_${new Date().toISOString()}.csv`;
    link.click();
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">My Loans</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {loans.map((loan) => {
          const isActive = loan.status === "Active";
          const loanId = String(loan.id);
          const schedule = MOCK_SCHEDULES[loanId] ?? [];

          return (
            <Card
              key={loanId}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)] rounded-lg"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">
                      Loan #{loanId}
                    </h2>
                    <div className="text-sm text-[var(--color-muted)]">
                      {loan.product ?? "Loan"} • Started:{" "}
                      {loan.startDate ?? "-"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-[var(--color-muted)]">
                      Amount
                    </div>
                    <div className="text-xl font-bold text-[var(--color-text)]">
                      {formatCurrency(loan.amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-[var(--color-muted)]">
                      Status
                    </div>
                    <div
                      className={`${
                        isActive
                          ? "text-[var(--success)]"
                          : "text-[var(--color-muted)]"
                      } font-medium`}
                    >
                      {loan.status}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-[var(--color-muted)]">
                      Outstanding
                    </div>
                    <div
                      className={`${
                        loan.balance > 0
                          ? "text-[var(--danger)]"
                          : "text-[var(--success)]"
                      } font-medium`}
                    >
                      {formatCurrency(loan.balance)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    className="btn-ghost"
                    onClick={() => toggleSchedule(loanId)}
                  >
                    {expanded[loanId] ? "Hide Schedule" : "View Schedule"}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() =>
                      alert(`Open repayment for ${loanId} (implement)`)
                    }
                  >
                    Make Payment
                  </Button>

                  <Button
                    size="sm"
                    className="btn-ghost"
                    onClick={() => downloadSchedule(loanId)}
                  >
                    Download Statement
                  </Button>
                </div>

                {expanded[loanId] && (
                  <div className="mt-4">
                    <div className="text-sm text-[var(--color-muted)] mb-2">
                      Repayment Schedule
                    </div>
                    {schedule.length === 0 ? (
                      <div className="text-sm text-[var(--color-muted)]">
                        No schedule available.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded border border-[var(--color-border)] bg-[var(--color-bg)]">
                        <table className="w-full min-w-[520px]">
                          <thead>
                            <tr>
                              <th className="p-2 text-left text-[var(--color-muted)]">
                                Instalment
                              </th>
                              <th className="p-2 text-left text-[var(--color-muted)]">
                                Due Date
                              </th>
                              <th className="p-2 text-right text-[var(--color-muted)]">
                                Amount
                              </th>
                              <th className="p-2 text-left text-[var(--color-muted)]">
                                Paid
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.map((s, i) => (
                              <tr
                                key={i}
                                className="hover:bg-surface/40"
                                style={{
                                  borderTop: "1px solid var(--color-border)",
                                }}
                              >
                                <td className="p-2 text-[var(--color-text)]">
                                  {s.instalment}
                                </td>
                                <td className="p-2 text-[var(--color-text)]">
                                  {s.dueDate}
                                </td>
                                <td className="p-2 text-right text-[var(--color-text)]">
                                  {formatCurrency(s.amount)}
                                </td>
                                <td className="p-2 text-[var(--color-text)]">
                                  {s.paid ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
