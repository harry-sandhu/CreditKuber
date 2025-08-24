import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <form className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Input placeholder="Your Name" />
        <Input placeholder="Email Address" type="email" />
        <Textarea placeholder="Your Message" rows={5} />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  );
}
