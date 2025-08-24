// src/lib/helpers.ts

/**
 * ✅ Format currency nicely
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * ✅ Format date
 */
export function formatDate(
  date: string | Date,
  locale: string = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * ✅ Truncate long text
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

/**
 * ✅ Generate random ID (for UI keys, etc.)
 */
export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * ✅ Check if object is empty
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * ✅ Debounce function (delay execution)
 */
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
