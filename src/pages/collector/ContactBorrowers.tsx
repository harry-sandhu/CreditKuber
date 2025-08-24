import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactBorrowers() {
  const borrowers = [
    { id: 1, name: "Ravi Kumar", phone: "+91 98765 43210" },
    { id: 2, name: "Anita Sharma", phone: "+91 87654 32109" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact Borrowers</h1>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold">Quick Message</h2>
        <form className="flex space-x-2">
          <Input placeholder="Enter borrower's phone/email" />
          <Input placeholder="Type message" className="flex-1" />
          <Button type="submit">Send</Button>
        </form>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-lg font-semibold">Borrower Directory</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">{b.name}</td>
                <td className="border p-2">{b.phone}</td>
                <td className="border p-2">
                  <Button size="sm">Send SMS</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
