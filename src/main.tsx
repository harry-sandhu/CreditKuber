// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css"; // CSS variables
import "./index.css"; // Tailwind + mappings
import App from "./App";
import { ThemeProvider } from "@/context/ThemeProvider";

// apply stored theme/tenant immediately to avoid flash (keeps your earlier logic)
try {
  const storedTheme =
    typeof window !== "undefined"
      ? localStorage.getItem("creditkuber:theme")
      : null;
  const storedTenant =
    typeof window !== "undefined" ? localStorage.getItem("tenant") : null;
  if (typeof document !== "undefined") {
    if (storedTheme)
      document.documentElement.setAttribute("data-theme", storedTheme);
    if (storedTenant) document.body.setAttribute("data-tenant", storedTenant);
  }
} catch (e) {
  // ignore
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
