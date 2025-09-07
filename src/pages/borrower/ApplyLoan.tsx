import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoanForm = {
  amount: number | "";
  purpose: string;
  tenure: number | "";
};

export default function ApplyLoan() {
  const [form, setForm] = useState<LoanForm>({
    amount: "",
    purpose: "",
    tenure: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoanForm, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function validate(current: LoanForm) {
    const e: typeof errors = {};
    if (!current.amount || current.amount <= 0)
      e.amount = "Enter a valid amount.";
    if (!current.purpose || current.purpose.trim().length < 3)
      e.purpose = "Purpose is required.";
    if (!current.tenure || current.tenure <= 0)
      e.tenure = "Enter a valid tenure.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!validate(form)) {
      setMessage("Fix validation errors above.");
      return;
    }

    setSubmitting(true);
    try {
      // Replace with API: await api.post("/api/borrower/apply-loan", form);
      await new Promise((r) => setTimeout(r, 800));
      setMessage("Loan application submitted successfully.");
      setForm({ amount: "", purpose: "", tenure: "" }); // reset form
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit application. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="max-w-lg space-y-6 min-h-screen p-6 rounded-lg"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Apply for a Loan</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded-lg border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-soft)]"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Loan Amount
          </label>
          <Input
            type="number"
            value={form.amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, amount: Number(e.target.value) }))
            }
            placeholder="Enter amount"
          />
          {errors.amount && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.amount}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Purpose
          </label>
          <Input
            type="text"
            value={form.purpose}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, purpose: e.target.value }))
            }
            placeholder="E.g. Home Renovation"
          />
          {errors.purpose && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.purpose}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Tenure (months)
          </label>
          <Input
            type="number"
            value={form.tenure}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, tenure: Number(e.target.value) }))
            }
            placeholder="12"
          />
          {errors.tenure && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.tenure}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>

        {message && (
          <div
            className={`text-sm mt-2 ${
              message.includes("successfully")
                ? "text-[var(--success)]"
                : "text-[var(--danger)]"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
