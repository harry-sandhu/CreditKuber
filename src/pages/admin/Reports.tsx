import { Card, CardContent } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Monthly Disbursals</h2>
            <p className="mt-2 text-2xl font-bold text-blue-600">₹12,50,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Monthly Collections</h2>
            <p className="mt-2 text-2xl font-bold text-green-600">₹8,75,000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
