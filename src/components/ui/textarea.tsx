import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-md border border-border bg-surface p-2 text-text placeholder:text-muted shadow-soft
          focus:border-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--color-gold)/20] transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
