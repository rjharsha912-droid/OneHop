import { type ClassValue, clsx } from "clsx";

/** Merge conditional class names */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a number as Indian Rupees, e.g. 12400 -> "₹12,400" */
export function formatINR(amount: number | string | undefined | null): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (n === undefined || n === null || Number.isNaN(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Title-case a string, e.g. "goa" -> "Goa" */
export function titleCase(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

/** Returns initials from a full name, e.g. "Ananya Sharma" -> "AS" */
export function initials(name: string | undefined | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Simple delay helper, useful for staged UI reveals */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Format an ISO date string into a short, readable label */
export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Format an ISO date string into a relative-ish short time, e.g. "2h ago" */
export function timeAgo(iso: string | undefined | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}
