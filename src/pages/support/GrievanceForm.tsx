import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // object URL for preview
};

type Ticket = {
  id: string;
  name: string;
  email: string;
  loanAccount: string;
  details: string;
  attachments: Attachment[];
  createdAt: string; // ISO
  status: "Open" | "In Progress" | "Resolved";
};

const STORAGE_KEY = "support_grievance_tickets_v1";

function generateTicketId() {
  return `T-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function GrievanceForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loanAccount, setLoanAccount] = useState("");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [lastTicket, setLastTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTickets(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => attachments.forEach((a) => URL.revokeObjectURL(a.url));
  }, [attachments]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email.trim() || !isValidEmail(email))
      e.email = "Enter a valid email address.";
    if (!loanAccount.trim()) e.loanAccount = "Loan account number is required.";
    if (!details.trim() || details.trim().length < 10)
      e.details = "Please provide more details (min 10 characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      alert("Only PDF, PNG, JPG files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }
    const a: Attachment = {
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    };
    setAttachments((s) => [...s, a]);
    // clear input value so same file can be re-added if removed
    e.currentTarget.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((s) => {
      const filtered = s.filter((a) => a.id !== id);
      return filtered;
    });
  }

  async function handleSubmit(ev?: React.FormEvent) {
    ev?.preventDefault();
    setMessage(null);

    if (!validate()) {
      setMessage("Fix validation errors and try again.");
      return;
    }

    setSaving(true);

    try {
      // create ticket object
      const ticket: Ticket = {
        id: generateTicketId(),
        name: name.trim(),
        email: email.trim(),
        loanAccount: loanAccount.trim(),
        details: details.trim(),
        attachments,
        createdAt: new Date().toISOString(),
        status: "Open",
      };

      // Simulate API delay — replace with real API POST when ready.
      await new Promise((r) => setTimeout(r, 700));

      const newList = [ticket, ...tickets];
      setTickets(newList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setLastTicket(ticket);

      // clear form
      setName("");
      setEmail("");
      setLoanAccount("");
      setDetails("");
      setAttachments([]);
      setErrors({});
      setMessage(`Grievance submitted. Ticket ID: ${ticket.id}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit grievance. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setName("");
    setEmail("");
    setLoanAccount("");
    setDetails("");
    setAttachments([]);
    setErrors({});
    setMessage(null);
  }

  function downloadTicketCSV(t: Ticket) {
    const header = [
      "ticketId",
      "name",
      "email",
      "loanAccount",
      "details",
      "status",
      "createdAt",
    ];
    const line = [
      t.id,
      t.name,
      t.email,
      t.loanAccount,
      t.details.replace(/\n/g, " "),
      t.status,
      t.createdAt,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",");
    const csv = [header.join(","), line].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ticket_${t.id}.csv`;
    link.click();
  }

  return (
    <div
      className="mx-auto max-w-2xl space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="rounded-lg bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <h1 className="text-2xl font-bold mb-4">Submit a Grievance</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            {errors.name && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            {errors.email && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Loan Account Number
            </label>
            <Input
              value={loanAccount}
              onChange={(e) => setLoanAccount(e.target.value)}
              placeholder="Loan Account Number"
            />
            {errors.loanAccount && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.loanAccount}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Grievance Details
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your grievance in detail..."
              rows={6}
            />
            {errors.details && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.details}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Attachments (optional)
            </label>
            <input type="file" accept=".pdf,image/*" onChange={handleFile} />
            <div className="mt-2 space-y-2">
              {attachments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)]"
                >
                  <div className="text-sm">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">
                      {(a.size / 1024).toFixed(0)} KB • {a.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      View
                    </a>
                    <Button
                      size="sm"
                      className="btn-ghost"
                      onClick={() => removeAttachment(a.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit Grievance"}
            </Button>
            <Button
              type="button"
              className="btn-ghost"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </Button>
          </div>

          {message && (
            <div
              className={`text-sm ${
                message.includes("submitted")
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Last submitted ticket preview */}
      {lastTicket && (
        <div className="rounded-lg p-4 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-[var(--color-muted)]">
                Ticket submitted
              </div>
              <div className="font-semibold text-[var(--color-text)]">
                {lastTicket.id}
              </div>
              <div className="text-sm text-[var(--color-muted)] mt-1">
                Status:{" "}
                <span className="font-medium text-[var(--color-text)]">
                  {lastTicket.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => downloadTicketCSV(lastTicket)}>
                Download CSV
              </Button>
            </div>
          </div>

          <div className="mt-3 text-sm">
            <div>
              <strong>Name:</strong> {lastTicket.name}
            </div>
            <div>
              <strong>Email:</strong> {lastTicket.email}
            </div>
            <div>
              <strong>Loan:</strong> {lastTicket.loanAccount}
            </div>
            <div className="mt-2">
              <strong>Details:</strong>{" "}
              <div className="mt-1 text-[var(--color-text)] whitespace-pre-wrap">
                {lastTicket.details}
              </div>
            </div>
            {lastTicket.attachments.length > 0 && (
              <div className="mt-2">
                <strong>Attachments:</strong>
                <ul className="mt-1 space-y-1 text-sm">
                  {lastTicket.attachments.map((a) => (
                    <li key={a.id}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {a.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Past tickets list */}
      <div className="rounded-lg p-4 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="text-lg font-semibold mb-3">My submitted tickets</h2>
        {tickets.length === 0 ? (
          <div className="text-sm text-[var(--color-muted)]">
            No tickets submitted yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li
                key={t.id}
                className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] flex items-start justify-between"
              >
                <div>
                  <div className="font-medium">
                    {t.id} •{" "}
                    <span className="text-[var(--color-muted)] text-sm">
                      {new Date(t.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-muted)] mt-1">
                    {t.loanAccount} • {t.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="btn-ghost"
                    onClick={() => {
                      setLastTicket(t);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    View
                  </Button>
                  <Button size="sm" onClick={() => downloadTicketCSV(t)}>
                    Export
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
