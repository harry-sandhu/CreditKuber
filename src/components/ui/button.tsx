import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  // Tailwind classes for variants mapped to theme tokens
  const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "bg-primary text-white shadow-soft hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30]",
    outline:
      "border border-border text-text bg-transparent hover:bg-surface focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30]",
    destructive:
      "bg-danger text-white shadow-soft hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30]",
    secondary:
      "bg-secondary text-white shadow-soft hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/30]",
  };

  // Tailwind classes for sizes
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={`rounded-lg font-medium transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
