export default function Payments() {
  const payments = [
    { id: 1, borrower: "John Doe", amount: 5000, date: "2025-08-15" },
    { id: 2, borrower: "Jane Smith", amount: 3000, date: "2025-08-20" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>

      <table className="w-full border-collapse rounded-lg bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Borrower</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.borrower}</td>
              <td className="border p-2">₹{p.amount}</td>
              <td className="border p-2">{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
