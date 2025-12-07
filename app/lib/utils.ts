import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function merges Tailwind classes safely
// Example: cn("bg-red-500", isTrue && "text-white")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}