import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <Input type="text" defaultValue="LoanFlix Pvt. Ltd." />
        </div>

        <div>
          <label className="block text-sm font-medium">Support Email</label>
          <Input type="email" defaultValue="support@loanflix.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Input type="tel" defaultValue="+91 9876543210" />
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
