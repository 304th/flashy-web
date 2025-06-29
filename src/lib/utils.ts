import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notEmpty = <T>(obj: T | undefined): obj is T =>
  !obj
    ? false
    : typeof obj === "object"
      ? Object.keys(obj).length > 0 || (Array.isArray(obj) && obj.length > 0)
      : false;
