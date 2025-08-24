import { Card, CardContent } from "@/components/ui/card";

export default function RiskAssessment() {
  const riskReports = [
    { id: 1, name: "Ravi Kumar", score: 720, risk: "Low" },
    { id: 2, name: "Anita Sharma", score: 590, risk: "High" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Risk Assessment</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {riskReports.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">{r.name}</h2>
              <p className="mt-2">
                Credit Score: <span className="font-bold">{r.score}</span>
              </p>
              <p>
                Risk Level:{" "}
                <span
                  className={`font-bold ${
                    r.risk === "Low"
                      ? "text-green-600"
                      : r.risk === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {r.risk}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
