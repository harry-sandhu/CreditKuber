import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-6 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-lg">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Button onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );
}
