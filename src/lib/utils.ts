import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BlockedUrl } from "./posts.svelte";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}