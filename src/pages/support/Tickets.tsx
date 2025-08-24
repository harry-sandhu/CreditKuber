import { Button } from "@/components/ui/button";

export default function Tickets() {
  const tickets = [
    {
      id: 1,
      borrower: "Ravi Kumar",
      subject: "Loan repayment issue",
      status: "Open",
    },
    {
      id: 2,
      borrower: "Anita Sharma",
      subject: "EMI not updated",
      status: "In Progress",
    },
    {
      id: 3,
      borrower: "Vikas Mehta",
      subject: "Incorrect penalty",
      status: "Resolved",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>

      <table className="w-full border-collapse rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Borrower</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.borrower}</td>
              <td className="border p-2">{t.subject}</td>
              <td className="border p-2">{t.status}</td>
              <td className="border p-2 space-x-2">
                <Button size="sm">View</Button>
                <Button size="sm" variant="secondary">
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
