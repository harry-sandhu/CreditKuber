import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApplyLoan() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Apply for a Loan</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Loan Amount</label>
          <Input type="number" placeholder="Enter amount" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Purpose</label>
          <Input type="text" placeholder="E.g. Home Renovation" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Tenure (months)</label>
          <Input type="number" placeholder="12" required />
        </div>

        <Button type="submit" className="w-full">
          Submit Application
        </Button>
      </form>
    </div>
  );
}
