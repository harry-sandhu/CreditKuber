import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded border border-border bg-surface px-3 py-2 text-text placeholder:text-muted
        focus:border-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/20]
        transition-colors ${className}`}
      {...props}
    />
  );
}
