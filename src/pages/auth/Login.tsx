import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, user } = res.data;

      login(user, token);

      switch (role) {
        case "borrower":
          navigate("/borrower/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "officer":
          navigate("/officer/review");
          break;
        case "collector":
          navigate("/collector/overdues");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-bg text-text">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-soft border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-text">Login</h1>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border-l-4 border-[color:var(--color-danger)]/80 bg-[color:var(--color-danger)/6] p-3 text-sm text-danger"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm font-medium text-muted">Email</label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
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
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] rounded"
          >
            Register
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-muted">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30] rounded"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
