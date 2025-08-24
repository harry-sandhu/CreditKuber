import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore(); // ✅ Using login method from auth store

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🔹 Call backend login API
      const res = await api.post("/auth/login", { email, password });
      const { token, role, user } = res.data;

      // 🔹 Update global auth store in one call
      login(user, token);

      // 🔹 Redirect based on role
      switch (role) {
        case "borrower":
          navigate("/borrower/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "credit_analyst":
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
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>

        <p className="mt-2 text-center text-sm text-gray-600">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
}
