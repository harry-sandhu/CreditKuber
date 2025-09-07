import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Extended borrower profile page.
 * - Save/load to localStorage (STORAGE_KEY) for now.
 * - Replace localStorage calls with API calls when backend is ready.
 */

const STORAGE_KEY = "borrower_profile_v2";

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

type DocumentFile = {
  id: string;
  type: "PAN" | "AADHAAR" | "BANK_STATEMENT" | string;
  name: string;
  size: number;
  url: string; // object URL for preview (client-side)
};

type Profile = {
  fullName: string;
  dob: string; // yyyy-mm-dd
  gender: "" | "male" | "female" | "other";
  primaryPhone: string;
  primaryEmail: string;
  alternatePhone?: string;

  pan?: string;
  aadharLast4?: string; // store only last 4 in UI
  panVerified?: boolean;
  phoneVerified?: boolean;
  emailVerified?: boolean;

  currentAddress: Address;
  permanentAddress: Address;
  sameAsCurrent: boolean;

  employmentType:
    | ""
    | "Salaried"
    | "Self-Employed"
    | "Freelancer"
    | "Unemployed";
  employerName?: string;
  monthlyIncome?: number;

  bankIfsc?: string;
  bankAccountMasked?: string; // masked for UI
  upiId?: string;

  documents: DocumentFile[];
};

const DEFAULTS: Profile = {
  fullName: "",
  dob: "",
  gender: "",
  primaryPhone: "",
  primaryEmail: "",

  currentAddress: { line1: "", line2: "", city: "", state: "", pincode: "" },
  permanentAddress: { line1: "", line2: "", city: "", state: "", pincode: "" },
  sameAsCurrent: true,

  employmentType: "",
  employerName: "",
  monthlyIncome: undefined,

  documents: [],
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/[\s()+-]/g, "").replace(/^0+/, "");
  return /^\d{10,13}$/.test(digits);
}

function isValidPAN(pan: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test((pan || "").toUpperCase());
}

function maskAccount(account?: string) {
  if (!account) return "";
  const s = String(account);
  return s.length > 4 ? `XXXXXX${s.slice(-4)}` : s;
}

export default function BorrowerProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // merge defaults to be safe
        setProfile((p) => ({ ...p, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // sync sameAsCurrent -> permanent address
  useEffect(() => {
    if (profile.sameAsCurrent) {
      setProfile((p) => ({ ...p, permanentAddress: { ...p.currentAddress } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile.sameAsCurrent,
    profile.currentAddress.line1,
    profile.currentAddress.line2,
    profile.currentAddress.city,
    profile.currentAddress.state,
    profile.currentAddress.pincode,
  ]);

  function validate() {
    const e: Partial<Record<keyof Profile, string>> = {};
    if (!profile.fullName || profile.fullName.trim().length < 2)
      e.fullName = "Enter full name.";
    if (!profile.dob) e.dob = "Date of birth required.";
    if (!isValidPhone(profile.primaryPhone))
      e.primaryPhone = "Enter valid phone (10-13 digits).";
    if (!isValidEmail(profile.primaryEmail))
      e.primaryEmail = "Enter valid email.";
    if (profile.pan && !isValidPAN(profile.pan)) e.pan = "PAN format invalid.";
    if (profile.aadharLast4 && !/^\d{4}$/.test(profile.aadharLast4))
      e.aadharLast4 = "Enter last 4 digits of Aadhaar.";
    if (!profile.currentAddress.line1)
      e.currentAddress = "Current address is required.";
    if (!profile.currentAddress.city) e.currentAddress = "City required.";
    if (!profile.currentAddress.state) e.currentAddress = "State required.";
    if (!/^\d{6}$/.test(profile.currentAddress.pincode))
      e.currentAddress = "Invalid pincode (6 digits).";
    if (!profile.sameAsCurrent) {
      if (!profile.permanentAddress.line1)
        e.permanentAddress = "Permanent address required.";
      if (!/^\d{6}$/.test(profile.permanentAddress.pincode))
        e.permanentAddress = "Invalid permanent pincode.";
    }
    if (
      profile.monthlyIncome !== undefined &&
      (Number(profile.monthlyIncome) < 0 ||
        isNaN(Number(profile.monthlyIncome)))
    ) {
      e.monthlyIncome = "Enter valid income.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(ev?: React.FormEvent) {
    ev?.preventDefault();
    setMessage(null);
    if (!validate()) {
      setMessage("Fix validation errors and try again.");
      return;
    }

    setSaving(true);
    try {
      // TODO: replace with API call: await api.patch("/api/borrower/profile", profile)
      await new Promise((r) => setTimeout(r, 700));

      // persist locally for now
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setMessage("Profile saved locally. Wire to backend when ready.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setProfile(DEFAULTS);
    setErrors({});
    setMessage(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    docType: DocumentFile["type"]
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    // basic client-side validation
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      alert("Only PNG/JPEG/PDF files allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }
    const id = `${docType}-${Date.now()}`;
    const url = URL.createObjectURL(file);
    const doc: DocumentFile = {
      id,
      type: docType as any,
      name: file.name,
      size: file.size,
      url,
    };
    setProfile((p) => ({
      ...p,
      documents: [...p.documents.filter((d) => d.type !== docType), doc],
    }));
    // Note: revoke URL when cleaning up or after upload to server.
  }

  function removeDoc(id: string) {
    setProfile((p) => ({
      ...p,
      documents: p.documents.filter((d) => d.id !== id),
    }));
  }

  return (
    <div
      className="max-w-3xl space-y-6 min-h-screen p-6 rounded-lg"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">My Profile</h1>

      <form
        onSubmit={handleSave}
        className="space-y-6 p-6 rounded-lg border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-soft)]"
      >
        {/* Personal */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Full Name
            </label>
            <Input
              value={profile.fullName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, fullName: e.target.value }))
              }
              placeholder="Your full name"
            />
            {errors.fullName && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.fullName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Date of Birth
            </label>
            <Input
              type="date"
              value={profile.dob}
              onChange={(e) =>
                setProfile((p) => ({ ...p, dob: e.target.value }))
              }
            />
            {errors.dob && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.dob}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile((p) => ({ ...p, gender: e.target.value as any }))
              }
              className="px-3 py-2 rounded border w-full bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </section>

        {/* Contact */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Primary Phone
            </label>
            <Input
              value={profile.primaryPhone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, primaryPhone: e.target.value }))
              }
              placeholder="+91 98xxxx"
            />
            {errors.primaryPhone && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.primaryPhone}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Primary Email
            </label>
            <Input
              value={profile.primaryEmail}
              onChange={(e) =>
                setProfile((p) => ({ ...p, primaryEmail: e.target.value }))
              }
              placeholder="you@example.com"
            />
            {errors.primaryEmail && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.primaryEmail}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Alternate Phone
            </label>
            <Input
              value={profile.alternatePhone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, alternatePhone: e.target.value }))
              }
              placeholder="Optional alternate phone"
            />
          </div>
        </section>

        {/* Identity */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              PAN
            </label>
            <Input
              value={profile.pan ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, pan: e.target.value.toUpperCase() }))
              }
              placeholder="ABCDE1234F"
            />
            {errors.pan && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.pan}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Aadhaar (last 4)
            </label>
            <Input
              value={profile.aadharLast4 ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, aadharLast4: e.target.value }))
              }
              placeholder="1234"
            />
            {errors.aadharLast4 && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.aadharLast4}
              </div>
            )}
          </div>

          <div className="flex items-end">
            <div>
              <div className="text-sm text-[var(--color-muted)]">
                Verification
              </div>
              <div className="mt-1 text-sm">
                <span className="mr-2">
                  Phone: {profile.phoneVerified ? "Verified" : "Unverified"}
                </span>
                <span className="mr-2">
                  Email: {profile.emailVerified ? "Verified" : "Unverified"}
                </span>
                <span>
                  PAN: {profile.panVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Addresses */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[var(--color-text)]">
              Current Address
            </h3>
            <Input
              value={profile.currentAddress.line1}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  currentAddress: {
                    ...p.currentAddress,
                    line1: e.target.value,
                  },
                }))
              }
              placeholder="Address line 1"
            />
            <Input
              value={profile.currentAddress.line2}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  currentAddress: {
                    ...p.currentAddress,
                    line2: e.target.value,
                  },
                }))
              }
              placeholder="Address line 2"
              className="mt-2"
            />
            <div className="flex gap-2 mt-2">
              <Input
                value={profile.currentAddress.city}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    currentAddress: {
                      ...p.currentAddress,
                      city: e.target.value,
                    },
                  }))
                }
                placeholder="City"
              />
              <Input
                value={profile.currentAddress.state}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    currentAddress: {
                      ...p.currentAddress,
                      state: e.target.value,
                    },
                  }))
                }
                placeholder="State"
              />
              <Input
                value={profile.currentAddress.pincode}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    currentAddress: {
                      ...p.currentAddress,
                      pincode: e.target.value,
                    },
                  }))
                }
                placeholder="Pincode"
              />
            </div>
            {errors.currentAddress && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.currentAddress}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold mb-2 text-[var(--color-text)]">
                Permanent Address
              </h3>
              <label className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.sameAsCurrent}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      sameAsCurrent: e.target.checked,
                    }))
                  }
                />
                Same as current
              </label>
            </div>

            <Input
              value={profile.permanentAddress.line1}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  permanentAddress: {
                    ...p.permanentAddress,
                    line1: e.target.value,
                  },
                }))
              }
              placeholder="Address line 1"
              disabled={profile.sameAsCurrent}
            />
            <Input
              value={profile.permanentAddress.line2}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  permanentAddress: {
                    ...p.permanentAddress,
                    line2: e.target.value,
                  },
                }))
              }
              placeholder="Address line 2"
              className="mt-2"
              disabled={profile.sameAsCurrent}
            />
            <div className="flex gap-2 mt-2">
              <Input
                value={profile.permanentAddress.city}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    permanentAddress: {
                      ...p.permanentAddress,
                      city: e.target.value,
                    },
                  }))
                }
                placeholder="City"
                disabled={profile.sameAsCurrent}
              />
              <Input
                value={profile.permanentAddress.state}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    permanentAddress: {
                      ...p.permanentAddress,
                      state: e.target.value,
                    },
                  }))
                }
                placeholder="State"
                disabled={profile.sameAsCurrent}
              />
              <Input
                value={profile.permanentAddress.pincode}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    permanentAddress: {
                      ...p.permanentAddress,
                      pincode: e.target.value,
                    },
                  }))
                }
                placeholder="Pincode"
                disabled={profile.sameAsCurrent}
              />
            </div>
            {errors.permanentAddress && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.permanentAddress}
              </div>
            )}
          </div>
        </section>

        {/* Employment & Income */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Employment Type
            </label>
            <select
              value={profile.employmentType}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  employmentType: e.target.value as any,
                }))
              }
              className="px-3 py-2 rounded border w-full bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
            >
              <option value="">Select</option>
              <option value="Salaried">Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Employer / Business
            </label>
            <Input
              value={profile.employerName ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, employerName: e.target.value }))
              }
              placeholder="Employer or business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Monthly Income
            </label>
            <Input
              type="number"
              value={profile.monthlyIncome ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  monthlyIncome:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              placeholder="0"
            />
            {errors.monthlyIncome && (
              <div className="mt-1 text-sm text-[var(--danger)]">
                {errors.monthlyIncome}
              </div>
            )}
          </div>
        </section>

        {/* Bank details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              IFSC
            </label>
            <Input
              value={profile.bankIfsc ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bankIfsc: e.target.value }))
              }
              placeholder="ABCD0123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Account Number
            </label>
            <Input
              value={profile.bankAccountMasked ?? ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  bankAccountMasked: maskAccount(e.target.value),
                }))
              }
              placeholder="XXXXXX1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              UPI ID
            </label>
            <Input
              value={profile.upiId ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, upiId: e.target.value }))
              }
              placeholder="name@upi"
            />
          </div>
        </section>

        {/* Documents upload */}
        <section>
          <h3 className="text-md font-semibold text-[var(--color-text)] mb-2">
            KYC Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div className="text-sm text-[var(--color-muted)] mb-1">
                PAN Copy
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, "PAN")}
              />
              <div className="mt-2">
                {profile.documents
                  .filter((d) => d.type === "PAN")
                  .map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between mt-2"
                    >
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        {d.name}
                      </a>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() => removeDoc(d.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div className="text-sm text-[var(--color-muted)] mb-1">
                Aadhaar (front/back)
              </div>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, "AADHAAR")}
              />
              <div className="mt-2">
                {profile.documents
                  .filter((d) => d.type === "AADHAAR")
                  .map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between mt-2"
                    >
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        {d.name}
                      </a>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() => removeDoc(d.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]">
              <div className="text-sm text-[var(--color-muted)] mb-1">
                Bank Statement (optional)
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, "BANK_STATEMENT")}
              />
              <div className="mt-2">
                {profile.documents
                  .filter((d) => d.type === "BANK_STATEMENT")
                  .map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between mt-2"
                    >
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                      >
                        {d.name}
                      </a>
                      <Button
                        size="sm"
                        className="btn-ghost"
                        onClick={() => removeDoc(d.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
          <Button
            type="button"
            className="btn-ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Reset
          </Button>

          <div className="ml-auto text-sm text-[var(--color-muted)]">
            <div>Saved: {localStorage.getItem(STORAGE_KEY) ? "yes" : "no"}</div>
          </div>
        </div>

        {message && (
          <div
            className={`text-sm ${
              message.includes("saved")
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
