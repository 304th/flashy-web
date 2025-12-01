"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  changePercentage: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  changePercentage,
  className,
}: StatCardProps) {
  const isPositive = changePercentage.startsWith("+");

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg bg-base-200 p-4 border border-base-400",
        className,
      )}
    >
      <span className="text-sm text-base-800">{title}</span>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl text-white font-semibold">{value}</span>
        <span
          className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-500" : "text-red-500",
          )}
        >
          {changePercentage}
        </span>
      </div>
    </div>
  );
}
