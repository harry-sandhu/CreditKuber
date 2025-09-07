// src/pages/admin/Leads.tsx
import React, { useMemo, useState, useCallback } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Lead = {
  id: number;
  ref: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  pan?: string;
  amountRequested?: number;
  appliedAt?: string;
  status:
    | "Fresh leads"
    | "Callback"
    | "No answer"
    | "Interested"
    | "Not eligible"
    | "Incomplete"
    | "Docs received"
    | "Deleted profiles"
    | string;
  assignedTo?: string | null;
  score?: number;
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

const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    ref: "LEAD-1001",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi.k@example.com",
    city: "Patiala",
    pan: "ABCDE1234F",
    amountRequested: 50000,
    appliedAt: "2025-09-01",
    status: "Fresh leads",
    assignedTo: null,
    score: 72,
  },
  {
    id: 2,
    ref: "LEAD-1002",
    name: "Anita Sharma",
    phone: "+91 87654 32109",
    email: "anita.s@example.com",
    city: "Ambala",
    pan: "PQRST6789L",
    amountRequested: 30000,
    appliedAt: "2025-09-02",
    status: "Callback",
    assignedTo: "collector01",
    score: 64,
  },
  {
    id: 3,
    ref: "LEAD-1003",
    name: "Sunita Devi",
    phone: "+91 99887 66554",
    email: "sunita@example.com",
    city: "Chandigarh",
    pan: "UVWXZ1111A",
    amountRequested: 25000,
    appliedAt: "2025-09-03",
    status: "No answer",
    assignedTo: null,
    score: 0,
  },
];

function csvFromRows(rows: Lead[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "name",
    "phone",
    "email",
    "city",
    "pan",
    "amountRequested",
    "appliedAt",
    "status",
    "assignedTo",
    "score",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

/* -------------------- Lead Drawer Component -------------------- */
function LeadDrawer({
  viewing,
  closeView,
  openAssign,
}: {
  viewing: { open: boolean; lead?: Lead };
  closeView: () => void;
  openAssign: (lead: Lead) => void;
}) {
  if (!viewing.open || !viewing.lead) return null;
  const lead = viewing.lead; // now typed as Lead

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={closeView} />
      <div className="relative w-full max-w-md h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Lead Details — {lead.ref}</h3>
          <Button size="sm" className="btn-ghost" onClick={closeView}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <strong>Name:</strong> {lead.name}
          </div>
          <div>
            <strong>Phone:</strong> {lead.phone ?? "-"}
          </div>
          <div>
            <strong>Email:</strong> {lead.email ?? "-"}
          </div>
          <div>
            <strong>City:</strong> {lead.city ?? "-"}
          </div>
          <div>
            <strong>PAN:</strong> {lead.pan ?? "-"}
          </div>
          <div>
            <strong>Requested:</strong>{" "}
            {lead.amountRequested
              ? `₹${lead.amountRequested.toLocaleString()}`
              : "-"}
          </div>
          <div>
            <strong>Applied:</strong> {lead.appliedAt ?? "-"}
          </div>
          <div>
            <strong>Status:</strong> {lead.status}
          </div>
          <div>
            <strong>Assigned to:</strong> {lead.assignedTo ?? "-"}
          </div>
          <div>
            <strong>Score:</strong> {lead.score ?? "-"}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold">Actions</h4>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard?.writeText(lead.phone ?? "");
                  alert("Phone copied (mock)");
                }}
              >
                Copy Phone
              </Button>
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => openAssign(lead)}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  // UI state
  const [query, setQuery] = useState("");
  const [colPhone, setColPhone] = useState("");
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("All");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(10);
  const [assigning, setAssigning] = useState<{
    open: boolean;
    lead?: Lead;
    officer?: string;
  }>({ open: false });
  const [viewing, setViewing] = useState<{ open: boolean; lead?: Lead }>({
    open: false,
  });

  // Derived filtered list (used for export & DataTable rows)
  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (preset && preset !== "All" && l.status !== preset) return false;
      if (colPhone && !String(l.phone ?? "").includes(colPhone)) return false;
      if (!lower) return true;
      return (
        String(l.ref).toLowerCase().includes(lower) ||
        String(l.name).toLowerCase().includes(lower) ||
        String(l.phone ?? "")
          .toLowerCase()
          .includes(lower) ||
        String(l.email ?? "")
          .toLowerCase()
          .includes(lower) ||
        String(l.city ?? "")
          .toLowerCase()
          .includes(lower) ||
        String(l.pan ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [leads, query, colPhone, preset]);

  // selection helpers
  const toggleSelect = useCallback((id: number) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }, []);
  const selectAllOnPage = useCallback((ids: number[], checked: boolean) => {
    setSelected((s) => {
      const copy = { ...s };
      ids.forEach((id) => (copy[id] = checked));
      return copy;
    });
  }, []);

  // bulk actions
  const exportAllFiltered = useCallback(() => {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString()}.csv`;
    link.click();
  }, [filtered]);

  const exportSelected = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No leads selected");
    const rowsToExport = leads.filter((l) => ids.includes(l.id));
    const csv = csvFromRows(rowsToExport);
    if (!csv) return alert("No selected rows to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_selected_${new Date().toISOString()}.csv`;
    link.click();
  }, [selected, leads]);

  const bulkAssign = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No leads selected");
    setLeads((prev) =>
      prev.map((l) =>
        ids.includes(l.id) ? { ...l, assignedTo: "collector-bulk" } : l
      )
    );
    setSelected({});
    alert(`Assigned ${ids.length} leads to collector-bulk (mock)`);
  }, [selected]);

  const bulkDelete = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No leads selected");
    if (!confirm(`Delete ${ids.length} leads?`)) return;
    setLeads((prev) =>
      prev.map((l) =>
        ids.includes(l.id) ? { ...l, status: "Deleted profiles" } : l
      )
    );
    setSelected({});
  }, [selected]);

  // per-lead actions
  function openAssign(lead?: Lead) {
    setAssigning({ open: true, lead, officer: lead?.assignedTo ?? undefined });
  }
  async function performAssign(leadId?: number, officerId?: string) {
    setAssigning({ open: false });
    if (!leadId || !officerId) return;
    // TODO: API
    await new Promise((r) => setTimeout(r, 300));
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, assignedTo: officerId } : l))
    );
    alert(`Assigned ${leadId} → ${officerId} (mock)`);
  }

  function openView(lead: Lead) {
    setViewing({ open: true, lead });
  }
  function closeView() {
    setViewing({ open: false, lead: undefined });
  }

  function changeStatus(leadId: number, status: Lead["status"]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  }

  // DataTable columns: render checkbox column as first column so selection stays here
  const columns = useMemo(
    () => [
      {
        key: "select",
        label: "",
        width: "w-12",
        render: (_: any, row: Lead) => (
          <input
            aria-label={`select-${row.ref}`}
            type="checkbox"
            checked={!!selected[row.id]}
            onChange={() => toggleSelect(row.id)}
          />
        ),
      },
      { key: "ref", label: "Ref", width: "w-28" },
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "city", label: "City" },
      { key: "pan", label: "PAN" },
      {
        key: "amountRequested",
        label: "Amount",
        render: (v: any) => (v ? `₹${Number(v).toLocaleString()}` : "-"),
        width: "w-28",
      },
      { key: "appliedAt", label: "Applied", width: "w-36" },
      {
        key: "status",
        label: "Status",
        render: (v: any, row: Lead) => (
          <select
            value={row.status}
            onChange={(e) =>
              changeStatus(row.id, e.target.value as Lead["status"])
            }
            className="px-2 py-1 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        ),
        width: "w-40",
      },
      { key: "assignedTo", label: "Assigned", width: "w-32" },
      {
        key: "actions",
        label: "Action",
        width: "w-36",
        render: (_: any, row: Lead) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => openView(row)}
            >
              View
            </Button>
            <Button size="sm" onClick={() => openAssign(row)}>
              Assign
            </Button>
          </div>
        ),
      },
    ],
    [selected, toggleSelect]
  );

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Leads</h1>

      {/* Top controls */}
      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              aria-label="global-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search ref, name, phone, city, PAN, email..."
              className="w-80"
            />
            <Input
              aria-label="phone-search"
              value={colPhone}
              onChange={(e) => setColPhone(e.target.value)}
              placeholder="Phone column search"
              className="w-56"
            />
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as any)}
              className="px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              aria-label="preset-filter"
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
              }}
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportAllFiltered}
            >
              Export
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportSelected}
            >
              Export selected
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded border bg-transparent border-[var(--color-border)] text-[var(--color-text)]"
              aria-label="page-size"
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
        <div className="mt-3 flex items-center gap-2">
          <div className="text-sm text-[var(--color-muted)]">
            Selected: {Object.values(selected).filter(Boolean).length}
          </div>
          <Button size="sm" className="btn-ghost" onClick={bulkAssign}>
            Assign Selected
          </Button>
          <Button size="sm" onClick={bulkDelete} variant="destructive">
            Mark Deleted
          </Button>
        </div>
      </div>

      {/* DataTable (uses internal paging/search, but we feed it filtered rows and control pageSize) */}
      <DataTable
        columns={columns}
        rows={filtered}
        idKey="id"
        defaultPageSize={pageSize}
        showGlobalSearch={false}
        showPageSizeSelector={false}
      />

      {/* Assign modal */}
      {assigning.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAssigning({ open: false })}
          ></div>

          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Assign Lead {assigning.lead?.ref ?? ""}
            </h3>

            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Assign to (agent id)
              </label>
              <input
                value={assigning.officer ?? ""}
                onChange={(e) =>
                  setAssigning((s) => ({ ...s, officer: e.target.value }))
                }
                placeholder="collector01"
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setAssigning({ open: false })}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  performAssign(assigning.lead?.id, assigning.officer)
                }
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Drawer (safe: LeadDrawer checks presence) */}
      <LeadDrawer
        viewing={viewing}
        closeView={closeView}
        openAssign={openAssign}
      />
    </div>
  );
}
