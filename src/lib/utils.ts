import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceInput(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");
  
  // Convert to number and format with commas
  const number = parseInt(digits, 10);
  if (isNaN(number)) return "";
  
  return number.toLocaleString("en-US");
}

export function parsePriceInput(value: string): number {
  // Remove all non-digit characters and convert to number
  return parseInt(value.replace(/\D/g, ""), 10) || 0;
} 