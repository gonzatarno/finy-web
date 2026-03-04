import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Locale-agnostic currency formatting for global SaaS
// Uses dot as thousands separator, comma as decimal separator (Latam/EU standard)
export function formatLocal(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const sign = amount < 0 ? "-" : ""
  return `${sign}$ ${formatted}`
}

// Alias for backward compatibility
export const formatARS = formatLocal

export function formatUSD(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const sign = amount < 0 ? "-" : ""
  return `${sign}u$s ${formatted}`
}
