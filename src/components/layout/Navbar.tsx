import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <div className="text-lg font-bold text-gray-800">LoanFlix</div>

      <div className="flex items-center gap-4">
        {user && <span className="text-gray-700">Hi, {user.name}</span>}
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-sm"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
