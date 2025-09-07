// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-6xl">
          Welcome to <span className="text-primary">CreditKuber</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted">
          A smarter way to manage loans, repayments, and support — built for
          borrowers, admins, and officers.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to={PATHS.auth.login}
            className="rounded-xl bg-primary px-6 py-3 text-inverse shadow-soft hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-gold)/20]"
            aria-label="Get started - login"
          >
            Get Started
          </Link>

          <Link
            to={PATHS.about}
            className="rounded-xl border border-border px-6 py-3 text-text hover:bg-surface focus:outline-none focus:ring-4 focus:ring-[color:var(--color-primary)/20]"
            aria-label="Learn more about CreditKuber"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-text">
            Why CreditKuber?
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Borrowers",
                text: "Easily apply for loans, track repayments, and manage your profile in one place.",
              },
              {
                title: "Admins",
                text: "Monitor applications, manage users, and view financial reports.",
              },
              {
                title: "Officers",
                text: "Review applications and assess risks with powerful tools.",
              },
              {
                title: "Collectors",
                text: "Track overdue payments and manage borrower outreach effectively.",
              },
              {
                title: "Support",
                text: "Handle tickets and resolve borrower grievances smoothly.",
              },
              {
                title: "Secure",
                text: "Built with security and transparency in mind to protect your data.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <h3 className="text-lg font-semibold text-text">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-inverse">
            Ready to get started?
          </h2>
          <p className="mt-2 text-lg text-[color:var(--inverse-text)/0.9]">
            Sign up today and take control of your finances.
          </p>

          <Link
            to={PATHS.auth.register}
            className="mt-6 inline-block rounded-xl bg-surface px-6 py-3 text-primary shadow-soft hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-gold)/20]"
            aria-label="Create an account"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
}
