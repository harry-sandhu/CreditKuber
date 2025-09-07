import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SettingsForm = {
  companyName: string;
  supportEmail: string;
  phone: string;
};

const STORAGE_KEY = "admin_settings_v1";

const DEFAULTS: SettingsForm = {
  companyName: "LoanFlix Pvt. Ltd.",
  supportEmail: "support@loanflix.com",
  phone: "+91 9876543210",
};

function isValidEmail(email: string) {
  // simple but practical email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  // Allow formats like: 9876543210, +919876543210, 0919876543210, 919876543210
  const digits = phone.replace(/[\s()-]/g, "").replace(/^\+?0?/, "");
  return /^\d{10,13}$/.test(digits);
}

export default function Settings() {
  const [form, setForm] = useState<SettingsForm>(DEFAULTS);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SettingsForm, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // load from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setForm(JSON.parse(saved));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function validate(current: SettingsForm) {
    const e: typeof errors = {};
    if (!current.companyName || current.companyName.trim().length < 2) {
      e.companyName = "Company name is required.";
    }
    if (!current.supportEmail || !isValidEmail(current.supportEmail)) {
      e.supportEmail = "Enter a valid email address.";
    }
    if (!current.phone || !isValidPhone(current.phone)) {
      e.phone = "Enter a valid phone number (10-13 digits).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev?: React.FormEvent) {
    ev?.preventDefault();
    setMessage(null);

    if (!validate(form)) {
      setMessage("Fix validation errors above.");
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      // Replace this fake delay with a real API call:
      // await api.post('/api/admin/settings', form);
      await new Promise((r) => setTimeout(r, 700));

      // persist locally for now
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));

      setMessage("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save settings. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(DEFAULTS);
    setErrors({});
    setMessage(null);
    // optionally clear saved values:
    // localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div
      className="max-w-lg space-y-6 min-h-screen p-6 rounded-lg"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Company Name
          </label>
          <Input
            type="text"
            value={form.companyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, companyName: e.target.value }))
            }
            placeholder="Company name"
            className="w-full"
          />
          {errors.companyName && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.companyName}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Support Email
          </label>
          <Input
            type="email"
            value={form.supportEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, supportEmail: e.target.value }))
            }
            placeholder="support@example.com"
            className="w-full"
          />
          {errors.supportEmail && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.supportEmail}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
            Phone
          </label>
          <Input
            type="tel"
            value={form.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((s) => ({ ...s, phone: e.target.value }))
            }
            placeholder="+91 98765 43210"
            className="w-full"
          />
          {errors.phone && (
            <div className="mt-1 text-sm text-[var(--danger)]">
              {errors.phone}
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button type="submit" className="px-4" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            className="px-4 btn-ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>

          <div className="ml-auto text-sm text-[var(--color-muted)]">
            <div>
              Last saved:{" "}
              {(() => {
                try {
                  const raw = localStorage.getItem(STORAGE_KEY);
                  if (!raw) return "never";
                  // const parsed = JSON.parse(raw);
                  // no timestamp stored — display that saved exists
                  return "saved";
                } catch {
                  return "unknown";
                }
              })()}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`text-sm ${
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
