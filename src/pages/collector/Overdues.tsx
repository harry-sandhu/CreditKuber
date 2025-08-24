import { Button } from "@/components/ui/button";

export default function Overdues() {
  const overdueLoans = [
    { id: 1, borrower: "Ravi Kumar", amount: 15000, dueDate: "2025-08-10" },
    { id: 2, borrower: "Anita Sharma", amount: 25000, dueDate: "2025-07-28" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overdue Loans</h1>

      <table className="w-full border-collapse rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Borrower</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {overdueLoans.map((loan) => (
            <tr key={loan.id}>
              <td className="border p-2">{loan.borrower}</td>
              <td className="border p-2">₹{loan.amount}</td>
              <td className="border p-2">{loan.dueDate}</td>
              <td className="border p-2 space-x-2">
                <Button size="sm" variant="default">
                  Send Reminder
                </Button>
                <Button size="sm" variant="destructive">
                  Escalate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
