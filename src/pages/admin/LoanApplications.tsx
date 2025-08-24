import { Button } from "@/components/ui/button";

export default function LoanApplications() {
  const applications = [
    { id: 1, name: "John Doe", amount: 50000, status: "Pending" },
    { id: 2, name: "Jane Smith", amount: 30000, status: "Approved" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Loan Applications</h1>

      <table className="w-full border-collapse rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Applicant</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="border p-2">{app.name}</td>
              <td className="border p-2">₹{app.amount}</td>
              <td className="border p-2">{app.status}</td>
              <td className="border p-2 space-x-2">
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
