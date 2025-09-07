// src/pages/Unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg text-text">
      <div className="max-w-lg rounded-xl bg-surface p-6 text-center shadow-soft border border-border">
        <h1 className="text-2xl md:text-3xl font-bold text-danger">
          You are not allowed to access this page.
        </h1>
        <p className="mt-3 text-sm text-muted">
          Please contact your administrator if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}
