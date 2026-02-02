"use client";

import { cn } from "@/lib/utils";
import type { GamificationStatus } from "../../types";
import { RiMedalLine } from "@remixicon/react";

interface DailyLoginStreakProps {
  status: GamificationStatus;
}

// 30-Day Streak XP (10% inflation, rounded up)
const STREAK_XP = [
  5, 6, 7, 8, 9, 10, 11, 13, 15, 17, // Days 1-10
  19, 21, 24, 27, 30, 33, 37, 41, 46, 51, // Days 11-20
  57, 63, 70, 77, 85, 94, 104, 115, 127, 140, // Days 21-30
];

const STREAK_MILESTONES = {
  bronze: { day: 10, xpBonus: 50, name: "Flashy Regular", color: "text-amber-600" },
  silver: { day: 20, xpBonus: 100, name: "Flashy Consistent", color: "text-gray-400" },
  gold: { day: 30, xpBonus: 200, name: "Flashy Dedicated", color: "text-yellow-400" },
};

export const DailyLoginStreak = ({ status }: DailyLoginStreakProps) => {
  const currentStreak = status.dailyStreak || 0;
  const streakBadges = status.streakBadges || { bronze: false, silver: false, gold: false };

  // Calculate total XP earned from streak
  const totalStreakXp = STREAK_XP.slice(0, currentStreak).reduce(
    (sum, xp) => sum + xp,
    0
  );

  // Determine which days to show (show current week context)
  const startDay = Math.max(1, Math.floor((currentStreak - 1) / 10) * 10 + 1);
  const endDay = Math.min(30, startDay + 9);
  const daysToShow = Array.from(
    { length: endDay - startDay + 1 },
    (_, i) => startDay + i
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Daily Login</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-brand-100 font-medium">
            {currentStreak} day streak
          </span>
          {currentStreak > 0 && (
            <>
              <span className="text-base-500">•</span>
              <span className="text-base-500">
                {totalStreakXp.toLocaleString()} XP earned
              </span>
            </>
          )}
        </div>
      </div>

      {/* Streak Badges */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border",
            streakBadges.bronze
              ? "border-amber-600/50 bg-amber-600/10"
              : "border-base-400 bg-base-300/50 opacity-50"
          )}
        >
          <RiMedalLine
            className={cn(
              "w-4 h-4",
              streakBadges.bronze ? "text-amber-600" : "text-base-500"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              streakBadges.bronze ? "text-amber-600" : "text-base-500"
            )}
          >
            10 Days
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border",
            streakBadges.silver
              ? "border-gray-400/50 bg-gray-400/10"
              : "border-base-400 bg-base-300/50 opacity-50"
          )}
        >
          <RiMedalLine
            className={cn(
              "w-4 h-4",
              streakBadges.silver ? "text-gray-400" : "text-base-500"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              streakBadges.silver ? "text-gray-400" : "text-base-500"
            )}
          >
            20 Days
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border",
            streakBadges.gold
              ? "border-yellow-400/50 bg-yellow-400/10"
              : "border-base-400 bg-base-300/50 opacity-50"
          )}
        >
          <RiMedalLine
            className={cn(
              "w-4 h-4",
              streakBadges.gold ? "text-yellow-400" : "text-base-500"
            )}
          />
          <span
            className={cn(
              "text-xs font-medium",
              streakBadges.gold ? "text-yellow-400" : "text-base-500"
            )}
          >
            30 Days
          </span>
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
                "flex flex-col items-center justify-center min-w-[72px] h-[72px] rounded-lg border transition-all",
                isClaimed
                  ? "bg-brand-100/20 border-brand-100/50"
                  : isCurrent
                    ? "bg-base-300 border-brand-100/30 ring-2 ring-brand-100/20"
                    : "bg-base-300/50 border-base-400"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isClaimed ? "text-brand-100" : "text-base-500"
                )}
              >
                Day {dayNumber}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  isClaimed ? "text-white" : "text-base-400"
                )}
              >
                {xp} XP
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation hint for more days */}
      {endDay < 30 && (
        <p className="text-xs text-base-500 text-center">
          Keep your streak going to see days {endDay + 1}-30!
        </p>
      )}
    </div>
  );
};
