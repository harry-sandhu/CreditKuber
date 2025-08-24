import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Total Loans</h2>
            <p className="mt-2 text-2xl font-bold text-blue-600">124</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <p className="mt-2 text-2xl font-bold text-green-600">356</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Pending Applications</h2>
            <p className="mt-2 text-2xl font-bold text-red-600">18</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
