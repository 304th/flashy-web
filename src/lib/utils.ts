import { formatDistanceToNow } from "date-fns";
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

export const timeAgo = (timestamp: string) =>
  formatDistanceToNow(new Date(timestamp), { addSuffix: true });

export const parseDomainName = (link: `http${string}`) =>
  link.replace(/^https?:\/\//, "").replace(/\/$/, "");
