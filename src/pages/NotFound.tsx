import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-6 text-center bg-bg text-text">
      {/* Error code */}
      <h1 className="text-6xl font-extrabold text-danger drop-shadow-sm">
        404
      </h1>

      {/* Message */}
      <p className="text-lg text-muted">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Action */}
      <Button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-xl"
        variant="default"
      >
        Go Home
      </Button>
    </div>
  );
}
