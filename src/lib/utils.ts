import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BlockedUrl } from "./website.svelte";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}