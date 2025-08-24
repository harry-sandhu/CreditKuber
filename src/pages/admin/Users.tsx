import { Button } from "@/components/ui/button";

export default function Users() {
  const users = [
    { id: 1, name: "John Doe", role: "Borrower", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Credit Analyst", status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <table className="w-full border-collapse rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.status}</td>
              <td className="border p-2 space-x-2">
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="destructive">
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
