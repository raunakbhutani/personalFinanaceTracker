import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format Y-axis values for charts — handles small amounts (e.g. $12) correctly
export function formatChartAxis(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  return `$${value}`;
}

// Compute a sensible Y-axis max so small bars remain visible
export function getChartYMax(data: { income?: number; expenses?: number }[]): number {
  const max = data.reduce((acc, item) => {
    const peak = Math.max(item.income ?? 0, item.expenses ?? 0);
    return Math.max(acc, peak);
  }, 0);
  if (max === 0) return 100;
  const padded = max * 1.2;
  if (padded <= 100) return Math.ceil(padded / 10) * 10;
  if (padded <= 1_000) return Math.ceil(padded / 50) * 50;
  return Math.ceil(padded / 100) * 100;
}
