import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log(res);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-bg text-text">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-soft border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-text">
          Register
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

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="block text-sm font-medium text-muted">
            Full name
          </label>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <label className="block text-sm font-medium text-muted">Email</label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-muted">
            Password
          </label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <label className="block text-sm font-medium text-muted">
            Confirm password
          </label>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
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
