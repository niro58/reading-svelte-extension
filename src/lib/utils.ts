import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function trimUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const trimmedUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;
    return trimmedUrl;
  } catch (e) {
    return "";
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (e) {
    return false;
  }
}

export function randomString(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
