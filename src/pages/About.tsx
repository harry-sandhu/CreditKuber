import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="bg-bg text-text min-h-screen">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Empowering Credit. Enabling Growth.
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          At <span className="text-primary font-semibold">CreditKuber</span>, we
          believe credit should be accessible, transparent, and empowering — not
          intimidating. Our mission is to simplify lending for everyone.
        </p>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid gap-6 md:grid-cols-3">
        <Card className="border border-border bg-surface shadow-soft rounded-lg">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-primary">Our Mission</h2>
            <p className="text-muted">
              To democratize access to credit by leveraging technology, ensuring
              fair opportunities for all borrowers.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface shadow-soft rounded-lg">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-primary">Our Vision</h2>
            <p className="text-muted">
              A future where financial inclusion is the norm — where individuals
              and businesses thrive through easy, transparent lending.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface shadow-soft rounded-lg">
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-bold text-primary">Our Values</h2>
            <p className="text-muted">
              Transparency, empowerment, and trust. These principles guide
              everything we build for our borrowers and partners.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="bg-surface border-t border-border py-12 text-center">
        <h2 className="text-2xl font-bold">Join the Credit Revolution</h2>
        <p className="mt-2 text-muted max-w-xl mx-auto">
          Whether you’re a borrower or a financial institution, CreditKuber is
          here to power your growth journey.
        </p>
        <Button className="mt-6">Get Started</Button>
      </section>
    </div>
  );
}
