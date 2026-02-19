"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClaimStreak } from "../../mutations/use-claim-streak";
import type { GamificationStatus } from "../../types";

interface DailyLoginStreakProps {
  status: GamificationStatus;
}

// 30-Day Streak XP (10% inflation, rounded up)
const STREAK_XP = [
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17, // Days 1-10
  19,
  21,
  24,
  27,
  30,
  33,
  37,
  41,
  46,
  51, // Days 11-20
  57,
  63,
  70,
  77,
  85,
  94,
  104,
  115,
  127,
  140, // Days 21-30
];

export const DailyLoginStreak = ({ status }: DailyLoginStreakProps) => {
  const currentStreak = status.dailyStreak || 0;
  const unclaimedXp = status.unclaimedStreakXp || 0;
  const claimMutation = useClaimStreak();

  // Always show days 1-10 window context
  const startDay = Math.max(1, Math.floor((currentStreak - 1) / 10) * 10 + 1);
  const endDay = Math.min(30, startDay + 9);
  const daysToShow = Array.from(
    { length: endDay - startDay + 1 },
    (_, i) => startDay + i,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Daily Login</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-base-800">
            {currentStreak} day streak
          </span>
          {unclaimedXp > 0 && (
            <Button
              size="sm"
              onClick={() => claimMutation.mutate()}
              pending={claimMutation.isPending}
              className="min-w-[100px]"
            >
              Claim {unclaimedXp} XP
            </Button>
          )}
        </div>
      </div>

      {/* Streak Days */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {daysToShow.map((dayNumber) => {
          const isClaimed = dayNumber <= currentStreak;
          const isCurrent = dayNumber === currentStreak + 1;
          const xp = STREAK_XP[dayNumber - 1] || 0;

          return (
            <div
              key={dayNumber}
              className={cn(
                `flex flex-col items-center justify-center min-w-[72px] h-[72px]
                rounded-lg border transition-all`,
                isClaimed
                  ? "bg-brand-100/20 border-brand-100/50"
                  : isCurrent
                    ? "bg-base-300 border-brand-100"
                    : "bg-base-300/50 border-base-400",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isClaimed ? "text-brand-100" : "text-base-800",
                )}
              >
                Day {dayNumber}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  isClaimed ? "text-white" : "text-base-800",
                )}
              >
                {xp} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
