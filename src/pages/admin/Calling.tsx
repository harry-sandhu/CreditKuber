// src/pages/admin/Calling.tsx
import { useCallback, useMemo, useState } from "react";
import DataTable from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CallRow = {
  id: number;
  ref: string;
  borrower: string;
  mobile?: string;
  callDate?: string; // ISO
  outcome?: string;
  calledBy?: string;
  assignedTeam?: "calling" | "credit" | null;
  nextAction?: string;
  notes?: string;
};

const PRESETS = [
  "All",
  "Assigned to calling",
  "Assigned to credit",
  "Unassigned",
  "No answer",
  "Interested",
] as const;

const MOCK_CALLS: CallRow[] = [
  {
    id: 1,
    ref: "L-1001",
    borrower: "Ravi Kumar",
    mobile: "+91 98765 43210",
    callDate: "2025-09-05T10:00:00Z",
    outcome: "No Answer",
    calledBy: "caller01",
    assignedTeam: "calling",
    nextAction: "Callback",
    notes: "Busy",
  },
  {
    id: 2,
    ref: "L-1002",
    borrower: "Sunita Devi",
    mobile: "+91 98765 43202",
    callDate: "2025-09-05T11:00:00Z",
    outcome: "Payment Confirmed",
    calledBy: "caller02",
    assignedTeam: "credit",
    nextAction: "None",
    notes: "RTGS noted",
  },
  {
    id: 3,
    ref: "L-1003",
    borrower: "Aman Sharma",
    mobile: "+91 98765 43203",
    callDate: "2025-09-04T09:30:00Z",
    outcome: "Interested",
    calledBy: "caller03",
    assignedTeam: null,
    nextAction: "Create renewal case",
    notes: "",
  },
];

function csvFromRows(rows: CallRow[]) {
  if (!rows.length) return "";
  const keys = [
    "ref",
    "borrower",
    "mobile",
    "callDate",
    "outcome",
    "calledBy",
    "assignedTeam",
    "nextAction",
    "notes",
  ];
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys
      .map((k) => `"${String((r as any)[k] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...lines].join("\n");
}

function isoShort(date?: string) {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

/* Drawer component — safe check for viewing.row */
function CallDrawer({
  viewing,
  close,
  onAssign,
}: {
  viewing: { open: boolean; row?: CallRow };
  close: () => void;
  onAssign: (row: CallRow, team: string) => void;
}) {
  if (!viewing.open || !viewing.row) return null;
  const r = viewing.row;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full max-w-md h-full overflow-auto bg-[var(--color-bg)] border-l border-[var(--color-border)] p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Call — {r.ref}</h3>
          <Button size="sm" className="btn-ghost" onClick={close}>
            Close
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <div>
            <strong>Borrower:</strong> {r.borrower}
          </div>
          <div>
            <strong>Mobile:</strong> {r.mobile ?? "-"}
          </div>
          <div>
            <strong>Call Date:</strong> {isoShort(r.callDate)}
          </div>
          <div>
            <strong>Outcome:</strong> {r.outcome ?? "-"}
          </div>
          <div>
            <strong>Called By:</strong> {r.calledBy ?? "-"}
          </div>
          <div>
            <strong>Assigned Team:</strong> {r.assignedTeam ?? "Unassigned"}
          </div>
          <div>
            <strong>Next Action:</strong> {r.nextAction ?? "-"}
          </div>
          <div>
            <strong>Notes:</strong>{" "}
            <pre className="whitespace-pre-wrap">{r.notes ?? "-"}</pre>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard?.writeText(r.mobile ?? "");
                alert("Phone copied (mock)");
              }}
            >
              Copy Phone
            </Button>
            <Button
              size="sm"
              className="btn-ghost"
              onClick={() => onAssign(r, "calling")}
            >
              Assign to Calling
            </Button>
            <Button size="sm" onClick={() => onAssign(r, "credit")}>
              Assign to Credit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Calling() {
  const [rows, setRows] = useState<CallRow[]>(MOCK_CALLS);
  const [query, setQuery] = useState("");
  const [colMobile, setColMobile] = useState("");
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>("All");
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [pageSize, setPageSize] = useState(10);

  const [viewing, setViewing] = useState<{ open: boolean; row?: CallRow }>({
    open: false,
  });
  const [assignModal, setAssignModal] = useState<{
    open: boolean;
    row?: CallRow;
    team?: string;
  }>({ open: false });

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (preset === "Assigned to calling" && r.assignedTeam !== "calling")
        return false;
      if (preset === "Assigned to credit" && r.assignedTeam !== "credit")
        return false;
      if (preset === "Unassigned" && r.assignedTeam) return false;
      if (
        preset === "No answer" &&
        (r.outcome ?? "").toLowerCase() !== "no answer"
      )
        return false;
      if (
        preset === "Interested" &&
        (r.outcome ?? "").toLowerCase() !== "interested"
      )
        return false;
      if (colMobile && !(r.mobile ?? "").includes(colMobile)) return false;
      if (!lower) return true;
      return [r.ref, r.borrower, r.mobile, r.outcome, r.calledBy].some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [rows, query, colMobile, preset]);

  const toggleSelect = useCallback(
    (id: number) => setSelected((s) => ({ ...s, [id]: !s[id] })),
    []
  );
  const exportFiltered = useCallback(() => {
    const csv = csvFromRows(filtered);
    if (!csv) return alert("No data to export");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `calls_${new Date().toISOString()}.csv`;
    link.click();
  }, [filtered]);

  const exportSelected = useCallback(() => {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    const rowsToExport = rows.filter((r) => ids.includes(r.id));
    const csv = csvFromRows(rowsToExport);
    if (!csv) return alert("No data");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `calls_selected_${new Date().toISOString()}.csv`;
    link.click();
  }, [selected, rows]);

  function openView(row: CallRow) {
    setViewing({ open: true, row });
  }
  function closeView() {
    setViewing({ open: false, row: undefined });
  }

  function openAssign(row?: CallRow) {
    setAssignModal({ open: true, row, team: row?.assignedTeam ?? undefined });
  }

  async function performAssign(rowId?: number, team?: string) {
    setAssignModal({ open: false });
    if (!rowId || !team) return;
    // mock: assign
    await new Promise((r) => setTimeout(r, 250));
    setRows((prev) =>
      prev.map((p) =>
        p.id === rowId ? { ...p, assignedTeam: team as any } : p
      )
    );
    alert(`Assigned ${rowId} → ${team} (mock)`);
  }

  function onAssignFromDrawer(row: CallRow, team: string) {
    // reuse performAssign
    performAssign(row.id, team);
    closeView();
  }

  const columns = useMemo(
    () => [
      {
        key: "select",
        label: "",
        render: (_: any, row: CallRow) => (
          <input
            aria-label={`select-${row.ref}`}
            type="checkbox"
            checked={!!selected[row.id]}
            onChange={() => toggleSelect(row.id)}
          />
        ),
      },
      { key: "ref", label: "Ref" },
      { key: "borrower", label: "Borrower" },
      { key: "mobile", label: "Mobile" },
      { key: "callDate", label: "Call Date", render: (v: any) => isoShort(v) },
      { key: "outcome", label: "Outcome" },
      { key: "calledBy", label: "Called By" },
      {
        key: "assignedTeam",
        label: "Assigned",
        render: (v: any) => v ?? "Unassigned",
      },
      { key: "nextAction", label: "Next Action" },
      {
        key: "actions",
        label: "Action",
        render: (_: any, row: CallRow) => (
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

  function bulkAssign(team: "calling" | "credit") {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, assignedTeam: team } : r))
    );
    setSelected({});
    alert(`Assigned ${ids.length} rows to ${team} (mock)`);
  }

  function bulkReassignToUnassigned() {
    const ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map(Number);
    if (!ids.length) return alert("No rows selected");
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, assignedTeam: null } : r))
    );
    setSelected({});
    alert(`Reverted ${ids.length} rows to Unassigned (mock)`);
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold">Calling & Assignments</h1>

      <div className="rounded-lg bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-80"
              placeholder="Search ref, borrower, phone, outcome..."
            />
            <Input
              value={colMobile}
              onChange={(e) => setColMobile(e.target.value)}
              className="w-56"
              placeholder="Phone column search"
            />
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as any)}
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
                setColMobile("");
                setPreset("All");
              }}
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportFiltered}
            >
              Export
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={exportSelected}
            >
              Export selected
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={() => bulkAssign("calling")}
            >
              Bulk → Calling
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={() => bulkAssign("credit")}
            >
              Bulk → Credit
            </button>
            <button
              className="px-3 py-2 border rounded btn-ghost"
              onClick={bulkReassignToUnassigned}
            >
              Bulk → Unassign
            </button>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
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
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        idKey="id"
        defaultPageSize={pageSize}
        showGlobalSearch={false}
        showPageSizeSelector={false}
      />

      {/* Assign modal */}
      {assignModal.open && assignModal.row && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAssignModal({ open: false })}
          />
          <div className="relative w-full max-w-md p-6 bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-lg">
            <h3 className="text-lg font-semibold">
              Assign Call — {assignModal.row.ref}
            </h3>
            <div className="mt-3">
              <label className="block text-sm text-[var(--color-muted)] mb-1">
                Team
              </label>
              <select
                value={assignModal.team ?? ""}
                onChange={(e) =>
                  setAssignModal((s) => ({ ...s, team: e.target.value }))
                }
                className="w-full px-3 py-2 rounded border bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)]"
              >
                <option value="">-- choose --</option>
                <option value="calling">calling</option>
                <option value="credit">credit</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                className="btn-ghost"
                onClick={() => setAssignModal({ open: false })}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  performAssign(assignModal.row?.id, assignModal.team)
                }
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      <CallDrawer
        viewing={viewing}
        close={closeView}
        onAssign={onAssignFromDrawer}
      />
    </div>
  );
}
