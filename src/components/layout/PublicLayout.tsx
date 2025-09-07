import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <PublicNavbar />
      <main className="flex-1 bg-surface">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
