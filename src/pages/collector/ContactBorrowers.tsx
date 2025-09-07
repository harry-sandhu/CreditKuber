import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Borrower = {
  id: number;
  ref?: string;
  name: string;
  phone: string;
  city?: string;
  status?: string; // one of presets
  assignedTo?: string;
  score?: number;
  amountRequested?: number;
  appliedAt?: string;
};

const PRESETS = [
  "All",
  "Fresh leads",
  "Callback",
  "No answer",
  "Interested",
  "Not eligible",
  "Incomplete",
  "Docs received",
  "Deleted profiles",
] as const;

const MOCK: Borrower[] = [
  {
    id: 1,
    ref: "L-1001",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    city: "Patiala",
    status: "Fresh leads",
    score: 72,
    amountRequested: 50000,
    appliedAt: "2025-09-01",
  },
  {
    id: 2,
    ref: "L-1002",
    name: "Anita Sharma",
    phone: "+91 87654 32109",
    city: "Ambala",
    status: "Callback",
    score: 64,
    amountRequested: 30000,
    appliedAt: "2025-09-03",
  },
  {
    id: 3,
    ref: "L-1003",
    name: "Sunita Devi",
    phone: "+91 99887 66554",
    city: "Chandigarh",
    status: "No answer",
    score: 0,
    amountRequested: 25000,
    appliedAt: "2025-09-04",
  },
  // add more mock rows as needed
];

function csvFromRows(rows: Borrower[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "name",
    "phone",
    "city",
    "status",
    "amountRequested",
    "appliedAt",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export default function ContactBorrowers() {
  const [borrowers, setBorrowers] = useState<Borrower[]>(MOCK);
  const [query, setQuery] = useState("");
  const [colPhone, setColPhone] = useState("");
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("All");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [quickRecipient, setQuickRecipient] = useState("");
  const [quickMessage, setQuickMessage] = useState("");
  const [logging, setLogging] = useState<{
    open: boolean;
    borrower?: Borrower;
  }>({ open: false });

  // filtered
  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return borrowers.filter((b) => {
      if (preset && preset !== "All" && b.status !== preset) return false;
      if (colPhone && !b.phone.includes(colPhone)) return false;
      if (!lower) return true;
      return [
        b.ref,
        b.name,
        b.phone,
        b.city,
        b.status,
        String(b.amountRequested),
      ].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [borrowers, query, colPhone, preset]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSelect(id: number) {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  }

  function selectAllOnPage(checked: boolean) {
    const pageIds = current.map((r) => r.id);
    setSelectedIds((s) => {
      const copy = { ...s };
      pageIds.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }

  function sendQuickMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const recipients = quickRecipient
      ? [quickRecipient]
      : current.map((r) => r.phone);
    // mock send
    alert(`Sending message to ${recipients.join(", ")}: "${quickMessage}"`);
    setQuickMessage("");
    setQuickRecipient("");
  }

  function bulkSendSMS() {
    const ids = Object.keys(selectedIds)
      .filter((k) => selectedIds[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No borrowers selected");
    const rows = borrowers.filter((b) => ids.includes(b.id));
    // mock send
    alert(`Sending SMS to: ${rows.map((r) => r.phone).join(", ")}`);
  }

  function bulkMarkCallback() {
    const ids = Object.keys(selectedIds)
      .filter((k) => selectedIds[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No borrowers selected");
    setBorrowers((prev) =>
      prev.map((b) => (ids.includes(b.id) ? { ...b, status: "Callback" } : b))
    );
    setSelectedIds({});
  }

  function exportCSV() {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `borrowers_${new Date().toISOString()}.csv`;
    link.click();
  }

  function logCall(borrower: Borrower, outcome: string, notes?: string) {
    // mock: append an entry (in real app you'd POST to API)
    console.log("Logging call:", borrower.id, outcome, notes);
    // update borrower status based on outcome
    setBorrowers((prev) =>
      prev.map((p) =>
        p.id === borrower.id
          ? {
              ...p,
              status:
                outcome === "Interested"
                  ? "Interested"
                  : outcome === "No Answer"
                  ? "No answer"
                  : p.status,
            }
          : p
      )
    );
    setLogging({ open: false });
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Contact Borrowers</h1>

      {/* Quick Message */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <h2 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
          Quick Message
        </h2>
        <form
          onSubmit={sendQuickMessage}
          className="flex flex-col gap-2 md:flex-row md:items-center"
        >
          <Input
            placeholder="Enter phone or leave empty to send to current page"
            value={quickRecipient}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuickRecipient(e.target.value)
            }
            className="w-full md:w-64"
            aria-label="Recipient phone"
          />
          <Input
            placeholder="Type message"
            value={quickMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuickMessage(e.target.value)
            }
            className="flex-1"
            aria-label="Message"
          />
          <Button type="submit" className="whitespace-nowrap">
            {quickMessage ? "Send" : "Send (empty message)"}
          </Button>
        </form>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search name, phone, city..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="w-64"
          />
          <Input
            placeholder="Phone column search"
            value={colPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setColPhone(e.target.value);
              setPage(0);
            }}
            className="w-44"
          />

          <select
            value={preset}
            onChange={(e) => {
              setPreset(e.target.value as any);
              setPage(0);
            }}
            className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQuery("");
              setColPhone("");
              setPreset("All");
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

      {/* Bulk actions */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-[var(--color-muted)]">
          Selected: {Object.values(selectedIds).filter(Boolean).length}
        </div>
        <Button size="sm" onClick={bulkSendSMS} className="btn-ghost">
          Send SMS
        </Button>
        <Button size="sm" onClick={bulkMarkCallback}>
          Mark Callback
        </Button>
      </div>

      {/* Directory */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2 text-[var(--color-muted)]">
                  <input
                    type="checkbox"
                    onChange={(e) => selectAllOnPage(e.target.checked)}
                  />
                </th>
                <th className="p-2 text-[var(--color-muted)]">Ref</th>
                <th className="p-2 text-[var(--color-muted)]">Name</th>
                <th className="p-2 text-[var(--color-muted)]">Phone</th>
                <th className="p-2 text-[var(--color-muted)]">City</th>
                <th className="p-2 text-[var(--color-muted)]">Status</th>
                <th className="p-2 text-[var(--color-muted)]">Requested</th>
                <th className="p-2 text-[var(--color-muted)]">Applied</th>
                <th className="p-2 text-[var(--color-muted)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-4 text-center text-[var(--color-muted)]"
                  >
                    No borrowers found
                  </td>
                </tr>
              )}

              {current.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-surface/60 transition-colors"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selectedIds[b.id]}
                      onChange={() => toggleSelect(b.id)}
                    />
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {b.ref ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">{b.name}</td>
                  <td className="p-2 text-[var(--color-text)]">{b.phone}</td>
                  <td className="p-2 text-[var(--color-text)]">
                    {b.city ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {b.status ?? "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {b.amountRequested
                      ? `₹${b.amountRequested.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="p-2 text-[var(--color-text)]">
                    {b.appliedAt ?? "-"}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => alert(`Send SMS to ${b.phone}`)}
                      >
                        Send SMS
                      </Button>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() => setLogging({ open: true, borrower: b })}
                      >
                        Log Call
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

      {/* Call logging modal (inline) */}
      {logging.open && logging.borrower && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setLogging({ open: false })}
          ></div>
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Log Call — {logging.borrower.name}
            </h3>
            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Outcome
              </label>
              <select
                id="outcome"
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              >
                <option>Interested</option>
                <option>No Answer</option>
                <option>Not Eligible</option>
                <option>Call Back</option>
                <option>Wrong Number</option>
              </select>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Notes
              </label>
              <Input placeholder="Add notes (optional)" />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setLogging({ open: false })}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  // read the outcome value
                  const sel = document.getElementById(
                    "outcome"
                  ) as HTMLSelectElement | null;
                  const outcome = sel ? sel.value : "No Answer";
                  const notesEl = document.querySelector<HTMLInputElement>(
                    'input[placeholder="Add notes (optional)"]'
                  );
                  const notes = notesEl?.value ?? "";
                  if (logging.borrower)
                    logCall(logging.borrower, outcome, notes);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
