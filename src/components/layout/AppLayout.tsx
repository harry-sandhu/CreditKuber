// src/components/layout/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
