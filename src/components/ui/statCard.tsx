import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number | string; // can be numeric or string
  tone?: "primary" | "success" | "danger" | "muted";
  className?: string;
  animated?: boolean; // only applies if value is a number
  duration?: number;
}

export default function StatCard({
  title,
  value,
  tone = "primary",
  className = "",
  animated = true,
  duration = 800,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(
    typeof value === "number" && animated ? 0 : value
  );

  useEffect(() => {
    if (typeof value !== "number" || !animated) {
      setDisplayValue(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (t: number) => {
      const progress = Math.min((t - start) / duration, 1);
      const current = Math.floor(from + (to - from) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animated, duration]);

  const toneClass = {
    primary: "text-primary",
    success: "text-success",
    danger: "text-danger",
    muted: "text-muted",
  }[tone];

  return (
    <div
      className={`bg-surface rounded-lg shadow-soft border border-border ${className}`}
    >
      <div className="p-6">
        <div className="text-sm font-medium text-muted">{title}</div>
        <div className={`mt-2 text-2xl font-bold ${toneClass}`}>
          {typeof displayValue === "number"
            ? displayValue.toLocaleString()
            : displayValue}
        </div>
      </div>
    </div>
  );
}
