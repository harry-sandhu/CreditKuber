import { Card, CardContent } from "@/components/ui/card";

export default function BorrowerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Borrower Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Active Loans</h2>
            <p className="mt-2 text-2xl font-bold text-blue-600">2</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Outstanding Balance</h2>
            <p className="mt-2 text-2xl font-bold text-red-600">₹45,000</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Next Due Date</h2>
            <p className="mt-2 text-2xl font-bold text-green-600">
              15 Sep 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
