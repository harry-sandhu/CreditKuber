import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: number;
  name: string;
  role: string;
  email?: string;
  mobile?: string;
  status: "Active" | "Inactive" | "Suspended";
  createdAt?: string;
};

const INITIAL_USERS: UserRow[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Borrower",
    status: "Active",
    email: "john@example.com",
    mobile: "9876500001",
    createdAt: "2025-05-10",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Credit Analyst",
    status: "Inactive",
    email: "jane@example.com",
    mobile: "9876500002",
    createdAt: "2025-06-20",
  },
];

function exportCSV(rows: UserRow[]) {
  const header = [
    "Name",
    "Role",
    "Email",
    "Mobile",
    "Status",
    "Created At",
  ].join(",");
  const lines = rows.map((r) =>
    [r.name, r.role, r.email ?? "", r.mobile ?? "", r.status, r.createdAt ?? ""]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `users_${new Date().toISOString()}.csv`;
  link.click();
}

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const roles = useMemo(
    () => Array.from(new Set(users.map((u) => u.role))),
    [users]
  );

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      if (!lower) return true;
      return [u.name, u.role, u.email ?? "", u.mobile ?? ""].some((v) =>
        v.toLowerCase().includes(lower)
      );
    });
  }, [users, q, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice(page * pageSize, (page + 1) * pageSize);

  function handleRemove(id: number) {
    if (!window.confirm("Remove this user? This action cannot be undone."))
      return;
    // TODO: call DELETE /api/admin/users/:id then update state from API
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function handleEdit(id: number) {
    // TODO: open modal or route to edit page; wiring example below
    const user = users.find((u) => u.id === id);
    if (!user) return;
    // placeholder: show prompt for name (replace with modal)
    const newName = window.prompt("Edit name", user.name);
    if (newName && newName.trim() !== "") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, name: newName } : u))
      );
      // TODO: call PATCH /api/admin/users/:id
    }
  }

  return (
    <div
      className="space-y-6 min-h-screen p-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, role, email, mobile..."
            className="px-3 py-2 rounded border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded border"
            style={{
              background: "transparent",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 rounded border"
            style={{
              background: "transparent",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <button
            className="px-3 py-2 border rounded btn-ghost"
            onClick={() => {
              setQ("");
              setRoleFilter("");
              setStatusFilter("");
              setPage(0);
            }}
          >
            Reset
          </button>

          <Button size="sm" onClick={() => exportCSV(filtered)}>
            Export
          </Button>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Name
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Role
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Email
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Mobile
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Status
              </th>
              <th
                className="p-3 text-left"
                style={{ color: "var(--color-muted)" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center"
                  style={{ color: "var(--color-muted)" }}
                >
                  No users found
                </td>
              </tr>
            )}

            {current.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-surface/40 transition-colors"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.email ?? "-"}</td>
                <td className="p-3">{u.mobile ?? "-"}</td>
                <td className="p-3">
                  <span
                    className="px-2 py-1 text-sm rounded"
                    style={{
                      background:
                        u.status === "Active"
                          ? "var(--glass-01)"
                          : u.status === "Inactive"
                          ? "rgba(0,0,0,0.03)"
                          : "rgba(192,41,41,0.06)",
                      color: "var(--color-text)",
                    }}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleEdit(u.id)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(u.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between">
        <div style={{ color: "var(--color-muted)" }}>
          Showing {filtered.length === 0 ? 0 : page * pageSize + 1} -{" "}
          {Math.min(filtered.length, (page + 1) * pageSize)} of{" "}
          {filtered.length}
        </div>

        <div className="flex items-center gap-2">
          <div style={{ color: "var(--color-muted)" }}>Page size:</div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 rounded border"
            style={{
              background: "transparent",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

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
          <div
            className="px-3 py-1 border rounded"
            style={{ color: "var(--color-muted)" }}
          >
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
  );
}
