import { formatDistanceToNow, isWithinInterval, subSeconds } from "date-fns";
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

export const timeAgo = (timestamp?: string | number, addSuffix = true) => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  const secondsDiff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (secondsDiff < 60 * 3) {
    return "Now";
  }

  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix });
  } catch {
    return formatDistanceToNow(new Date(Number(timestamp)), {
      addSuffix,
    }); //TODO: fix this
  }
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

export const timeout = (ms: number = 1000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

export const nonce = () => Math.random().toString(36).slice(2);

export const isTimeWithinSeconds = (
  timestamp: number,
  options: { seconds: number } = { seconds: 300 },
) => {
  const targetDate = new Date(timestamp);
  const now = new Date();
  const secondsAgo = subSeconds(now, options.seconds);

  return isWithinInterval(targetDate, {
    start: secondsAgo,
    end: now,
  });
};

export const uniqBy = <T, K>(array: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>();
  const result: T[] = [];

  for (const item of array) {
    const key = keyFn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);