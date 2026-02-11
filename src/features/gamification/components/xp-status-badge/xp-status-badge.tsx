"use client";

import { cn } from "@/lib/utils";
import { useGamificationStatus } from "../../queries/use-gamification-status";

interface XpStatusBadgeProps {
  className?: string;
}

export const XpStatusBadge = ({ className }: XpStatusBadgeProps) => {
  const { data: status, query } = useGamificationStatus();

  if (query.isLoading || !status) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full bg-base-300/80 border border-base-400",
        className
      )}
    >
      <span className="text-sm font-medium text-brand-100">
        Lv.{status.currentLevel}
      </span>
      <span className="text-xs text-base-800">•</span>
      <span className="text-xs text-base-800">
        {status.xpToNextLevel.toLocaleString()} XP Remaining
      </span>
    </div>
  );
};
