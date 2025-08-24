import { Card, CardContent } from "@/components/ui/card";

export default function LoanDetails() {
  // Later this will come from backend
  const loans = [
    { id: 1, amount: 20000, status: "Active", balance: 12000 },
    { id: 2, amount: 15000, status: "Closed", balance: 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Loans</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {loans.map((loan) => (
          <Card key={loan.id} className="shadow-md">
            <CardContent className="p-6 space-y-2">
              <h2 className="text-lg font-semibold">Loan #{loan.id}</h2>
              <p>Amount: ₹{loan.amount}</p>
              <p>Status: {loan.status}</p>
              <p>Outstanding: ₹{loan.balance}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
