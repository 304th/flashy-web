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

export const timeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const secondsDiff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (secondsDiff < 60 * 3) {
    return "Now";
  }

  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export const parseDomainName = (link: `http${string}`) =>
  link.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = (bytes / Math.pow(k, i)).toFixed(decimals);

  return `${value} ${sizes[i]}`;
};

export const prune = (objectToPrune: object) => {
  return Object.fromEntries(
    Object.entries(objectToPrune).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

export const timeout = (ms: number = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, ms)
})
