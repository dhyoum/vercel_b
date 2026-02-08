
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertPrice(priceKRW: number, currency: 'KRW' | 'USD'): string {
  if (currency === 'KRW') {
    return priceKRW.toLocaleString() + "원";
  } else {
    // Mock Exchange Rate: 1 USD = 1350 KRW
    const priceUSD = priceKRW / 1350;
    return "$" + priceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

export function formatLargeNumber(num: number, currency: 'KRW' | 'USD'): string {
  if (currency === 'KRW') {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + "조";
    } else if (num >= 100000000) {
      return (num / 100000000).toFixed(0) + "억";
    } else {
      return num.toLocaleString();
    }
  } else {
    // USD Styling
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(2) + "T";
    } else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else {
      return num.toLocaleString();
    }
  }
}
