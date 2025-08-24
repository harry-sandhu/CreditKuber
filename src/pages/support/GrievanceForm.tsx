import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GrievanceForm() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Submit a Grievance</h1>

      <form className="space-y-4">
        <Input placeholder="Full Name" />
        <Input placeholder="Email Address" type="email" />
        <Input placeholder="Loan Account Number" />
        <Textarea placeholder="Describe your grievance in detail..." rows={5} />

        <Button type="submit" className="w-full">
          Submit Grievance
        </Button>
      </form>
    </div>
  );
}
