export default function FAQ() {
  const faqs = [
    {
      q: "How fast can I get a loan?",
      a: "Loan approvals can happen within minutes after document verification.",
    },
    {
      q: "Do I need collateral?",
      a: "No, most loans are unsecured and don’t require collateral.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use bank-grade encryption to protect your information.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-white shadow">
            <h2 className="font-semibold">{item.q}</h2>
            <p className="text-gray-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
