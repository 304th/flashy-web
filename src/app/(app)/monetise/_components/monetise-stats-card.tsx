"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonetiseStatsCardProps {
  title: string;
  count?: number;
  isLocked?: boolean;
  className?: string;
}

export function MonetiseStatsCard({
  title,
  count,
  isLocked = false,
  className,
}: MonetiseStatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-base-600 bg-base-200 p-6 min-h-[120px]",
        className
      )}
    >
      {isLocked && (
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-base-400">
          <Lock className="w-6 h-6 text-base-800" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-medium">{title}</span>
        {count !== undefined && (
          <span className="text-sm text-base-800">{count}</span>
        )}
      </div>
    </div>
  );
}
