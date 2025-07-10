import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertAmountToMiliUnits(amount : number){
  return Math.round(amount * 1000)
}

export function convertMiliUnitsToAmount(amount : number){
  return Math.round(amount / 1000)
}

export function formatCurrency(amount : number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
}

export function calculatePercentage(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  } else return (100 * (current - previous)) / previous;
}
