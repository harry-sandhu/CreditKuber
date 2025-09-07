import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(
        res.data?.message || "Password reset link has been sent to your email."
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-bg text-text">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-soft border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-text">
          Forgot Password
        </h1>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border-l-4 border-[color:var(--color-danger)]/80 bg-[color:var(--color-danger)/6] p-3 text-sm text-danger"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mb-4 rounded-md border-l-4 border-[color:var(--color-success)]/80 bg-[color:var(--color-success)/6] p-3 text-sm text-success"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <label className="block text-sm font-medium text-muted">
            Registered email
          </label>

          <Input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Registered email"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Back to{" "}
          <a
            href="/login"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] rounded"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
