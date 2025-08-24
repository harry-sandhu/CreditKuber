import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BorrowerProfile() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input type="text" defaultValue="John Doe" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input type="email" defaultValue="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Input type="tel" defaultValue="+91 9876543210" />
        </div>

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </div>
  );
}
