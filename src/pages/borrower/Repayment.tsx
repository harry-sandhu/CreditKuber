import { Button } from "@/components/ui/button";

export default function Repayment() {
  // Example loan repayment info
  const nextDue = {
    loanId: 1,
    amount: 5000,
    dueDate: "15 Sep 2025",
  };

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Loan Repayment</h1>

      <div className="rounded border bg-white p-6 shadow">
        <p className="text-lg">Loan #{nextDue.loanId}</p>
        <p className="mt-2">Amount Due: ₹{nextDue.amount}</p>
        <p className="mt-2">Due Date: {nextDue.dueDate}</p>

        <Button className="mt-4 w-full">Pay Now</Button>
      </div>
    </div>
  );
}
