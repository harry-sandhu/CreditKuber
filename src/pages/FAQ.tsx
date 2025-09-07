// src/pages/FAQ.tsx
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Themed, accessible FAQ with search + accordion behavior.
 * Uses your theme tokens: bg-bg, bg-surface, text-text, text-muted, border-border, shadow-soft, text-primary
 */

type FaqItem = {
  id: string;
  q: string;
  a: string;
  category?: string;
};

const FAQ_DATA: FaqItem[] = [
  {
    id: "fast-loan",
    q: "How fast can I get a loan?",
    a: "After you complete your application and upload required documents, many loans can be approved within minutes. Complex or higher-value loans may require manual review and take 1–3 business days.",
    category: "Process",
  },
  {
    id: "collateral",
    q: "Do I need collateral?",
    a: "No — most retail loans on our platform are unsecured. For larger business or mortgage-style products, collateral may be required and will be clearly communicated during application.",
    category: "Eligibility",
  },
  {
    id: "data-security",
    q: "Is my data secure?",
    a: "Yes. We use bank-grade encryption in transit and at rest. Access to sensitive data is restricted and audited; you can review our full security practices in the Privacy Policy.",
    category: "Security",
  },
  {
    id: "repayment-options",
    q: "What repayment options do I have?",
    a: "You can pay via UPI, net-banking, or linked bank account. We also support scheduled auto-debits for recurring EMIs. Partial prepayments are accepted depending on loan terms—check your loan agreement.",
    category: "Payments",
  },
  {
    id: "late-fees",
    q: "What happens if I miss an EMI?",
    a: "Late payments may incur a nominal penalty and be reported to credit bureaus depending on the loan terms. We notify you in advance and provide multiple reminders; contact support if you face difficulties.",
    category: "Payments",
  },
  {
    id: "documents",
    q: "Which documents are required to apply?",
    a: "Typically: 1) ID proof (Aadhaar/PAN/Passport), 2) Address proof, 3) Recent bank statements / salary slips. Specific products may ask for additional documents. Uploading clear scans speeds up processing.",
    category: "Process",
  },
  {
    id: "eligibility",
    q: "Am I eligible to apply?",
    a: "Eligibility depends on product: factors include age, residency, income, and credit history. Start an application and our pre-check will show likely eligibility instantly.",
    category: "Eligibility",
  },
  {
    id: "support",
    q: "How do I contact support?",
    a: "Use the Contact page or in-app support to submit a ticket. For urgent payment issues, call our support line available on the Contact page. We aim to respond within 24 hours.",
    category: "Support",
  },
];

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(FAQ_DATA[0].id); // single-open accordion
  const [category, setCategory] = useState<string>("All");

  // derived categories
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(FAQ_DATA.map((f) => f.category).filter(Boolean))
    );
    return ["All", ...cats];
  }, []);

  // filtering + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_DATA.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (!q) return true;
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    });
  }, [query, category]);

  // keyboard: open with Enter/Space when focused on header
  useEffect(() => {
    // no global listeners needed; handled on element level
  }, []);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto bg-bg text-text min-h-screen p-6">
      <header className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted">
          Find quick answers to common questions. Use search to narrow results,
          or pick a category.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search questions or answers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
              aria-label="Search FAQs"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded px-2 py-1 border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/20]"
              aria-label="Filter FAQ category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setActiveId(null);
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("contact-cta")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      <main className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-surface p-6 border border-border shadow-soft">
            <p className="text-text">
              No results for <strong>{query}</strong>.
            </p>
            <p className="text-muted mt-2">
              Try different keywords or contact support if you need help.
            </p>
            <div className="mt-4">
              <Button
                onClick={() =>
                  document
                    .getElementById("contact-cta")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Contact Support
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2" role="list">
            {filtered.map((f) => {
              const isOpen = activeId === f.id;
              return (
                <li
                  key={f.id}
                  className="rounded-lg bg-surface border border-border shadow-soft overflow-hidden"
                >
                  {/* header */}
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${f.id}`}
                    id={`faq-header-${f.id}`}
                    onClick={() => toggle(f.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(f.id);
                      }
                    }}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/20]"
                  >
                    <div>
                      <div className="text-text font-medium">{f.q}</div>
                      {f.category && (
                        <div className="text-xs text-muted mt-1">
                          {f.category}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex items-center gap-3">
                      <svg
                        className={`h-5 w-5 transform transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M6 8l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* panel with smooth height transition */}
                  <div
                    id={`faq-panel-${f.id}`}
                    role="region"
                    aria-labelledby={`faq-header-${f.id}`}
                    className={`px-4 transition-[max-height,opacity] duration-300 ease-in-out ${
                      isOpen
                        ? "opacity-100 py-4 max-h-[800px]"
                        : "opacity-0 max-h-0"
                    }`}
                    style={{ willChange: "max-height, opacity" }}
                  >
                    <div className="text-muted">{f.a}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Contact CTA */}
      <section
        id="contact-cta"
        className="mt-8 rounded-lg bg-surface p-6 border border-border shadow-soft"
      >
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="text-muted mt-1">
          If the answer you need isn't here, our support team is happy to help.
          You can submit a ticket or message us directly.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => (window.location.href = "/contact")}>
            Contact Us
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/support-tickets")}
          >
            View Support Tickets
          </Button>
        </div>
      </section>
    </div>
  );
}
