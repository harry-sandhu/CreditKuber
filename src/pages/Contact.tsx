import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="bg-bg text-text min-h-screen p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Title + intro */}
        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted">
            Need help or have a question? Our support team is ready to help —
            reach us via the form or the channels listed here. We aim to respond
            within 24 hours for general inquiries.
          </p>

          {/* Contact info card */}
          <div className="mt-4 rounded-lg bg-surface p-4 shadow-soft border border-border space-y-3">
            <div>
              <div className="text-sm font-medium text-muted">Office</div>
              <div className="text-text">CreditKuber Pvt. Ltd.</div>
              <div className="text-muted text-sm">
                12 Finance Street, Business Park, Mumbai, Maharashtra, India
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted">Phone</div>
              <a
                href="tel:+919876543210"
                className="text-primary hover:underline inline-block"
              >
                +91 98765 43210
              </a>
            </div>

            <div>
              <div className="text-sm font-medium text-muted">
                Support Email
              </div>
              <a
                href="mailto:support@creditkuber.com"
                className="text-primary hover:underline inline-block"
              >
                support@creditkuber.com
              </a>
            </div>

            <div>
              <div className="text-sm font-medium text-muted">Office Hours</div>
              <div className="text-text text-sm">
                Mon — Fri: 10:00 — 19:00 IST
              </div>
              <div className="text-muted text-sm">
                Sat — Sun: Limited support
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Twitter"
                className="rounded p-1 hover:bg-surface/70"
                title="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M8 19c7.732 0 11.958-6.402 11.958-11.95 0-.182 0-.364-.013-.545A8.548 8.548 0 0 0 22 4.6a8.19 8.19 0 0 1-2.357.646A4.12 4.12 0 0 0 21.448 3a8.243 8.243 0 0 1-2.605.996A4.108 4.108 0 0 0 11.07 7.29 11.65 11.65 0 0 1 3.16 3.3a4.108 4.108 0 0 0 1.27 5.485A4.07 4.07 0 0 1 2.8 8.2v.05a4.106 4.106 0 0 0 3.294 4.023 4.095 4.095 0 0 1-1.085.146c-.266 0-.525-.026-.776-.074a4.111 4.111 0 0 0 3.834 2.85A8.236 8.236 0 0 1 2 17.54a11.616 11.616 0 0 0 6.29 1.84"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded p-1 hover:bg-surface/70"
                title="LinkedIn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-14h3v2.4a3.6 3.6 0 0 1 3.2-1.6zM2 9h4v14h-4zM4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="rounded p-1 hover:bg-surface/70"
                title="WhatsApp"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.472-.149-.672.149-.198.297-.768.967-.942 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.148-.173.198-.298.298-.497.099-.198.05-.372-.025-.52-.074-.149-.672-1.612-.92-2.21-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372-.273.298-1.04 1.016-1.04 2.479 0 1.462 1.064 2.88 1.212 3.078.148.198 2.095 3.2 5.076 4.487 2.98 1.288 3.144 1.066 3.71 1.002.567-.066 1.758-.718 2.006-1.412.248-.695.248-1.29.173-1.412-.074-.123-.272-.198-.569-.347zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-4 space-y-2">
            <a href="/faq" className="block text-primary hover:underline">
              Help Center / FAQ
            </a>
            <a
              href="/support-tickets"
              className="block text-primary hover:underline"
            >
              View support tickets
            </a>
            <a href="/terms" className="block text-muted hover:underline">
              Terms &amp; Privacy
            </a>
          </div>
        </div>

        {/* Right: Form (takes 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-surface p-6 shadow-soft border border-border">
            <h2 className="text-xl font-semibold text-text mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-muted mb-4">
              Fill the form and our support team will get back to you as soon as
              possible.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Your Name
                </label>
                <Input placeholder="Full name" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Email Address
                </label>
                <Input placeholder="you@company.com" type="email" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Subject
                </label>
                <Input
                  placeholder="Subject (e.g. Refund, EMI, Account)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">
                  Message
                </label>
                <Textarea
                  placeholder="Describe your message..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit">Send Message</Button>
                <Button variant="outline">Clear</Button>
              </div>

              <p className="text-xs text-muted mt-2">
                By contacting us you agree to our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  privacy policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
