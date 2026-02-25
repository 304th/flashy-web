"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { DailyLoginStreak } from "../daily-login-streak";
import { ChallengeSection } from "../challenge-section";
import { useGamificationStatus } from "../../queries/use-gamification-status";
import {
  useChallenges,
  useDailyChallenges,
} from "../../queries/use-challenges";
import { RiArrowRightSLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export const ChallengesOverview = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryString = searchParams.toString();
  const basePath = pathname.startsWith("/profile") ? "/profile" : "/channel";

  const { data: status, query: statusQuery } = useGamificationStatus();
  const { data: challengesData, query: challengesQuery } = useChallenges();
  const { data: dailyChallengesData, query: dailyChallengesQuery } =
    useDailyChallenges();

  const isLoading =
    statusQuery.isPending ||
    challengesQuery.isPending ||
    dailyChallengesQuery.isPending;

  // Group challenges by type
  const groupedChallenges = useMemo(() => {
    if (!challengesData?.challenges) return { basic: [], advanced: [] };

    return {
      basic: challengesData.challenges.filter((c) => c.type === "basic"),
      advanced: challengesData.challenges.filter((c) => c.type === "advanced"),
    };
  }, [challengesData]);

  // Calculate stats for each type
  const basicStats = useMemo(() => {
    const challenges = groupedChallenges.basic;
    return {
      completed: challenges.filter((c) => c.isClaimed).length,
      total: challenges.length,
      xpEarned: challenges
        .filter((c) => c.isClaimed)
        .reduce((sum, c) => sum + c.xpReward, 0),
      xpAvailable: challenges.reduce((sum, c) => sum + c.xpReward, 0),
    };
  }, [groupedChallenges.basic]);

  const advancedStats = useMemo(() => {
    const challenges = groupedChallenges.advanced;
    return {
      completed: challenges.filter((c) => c.isClaimed).length,
      total: challenges.length,
      xpEarned: challenges
        .filter((c) => c.isClaimed)
        .reduce((sum, c) => sum + c.xpReward, 0),
      xpAvailable: challenges.reduce((sum, c) => sum + c.xpReward, 0),
    };
  }, [groupedChallenges.advanced]);

  const totalStats = useMemo(() => {
    return {
      completed: basicStats.completed + advancedStats.completed,
      total: basicStats.total + advancedStats.total,
      xpEarned: basicStats.xpEarned + advancedStats.xpEarned,
      xpAvailable: basicStats.xpAvailable + advancedStats.xpAvailable,
    };
  }, [basicStats, advancedStats]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-24 bg-base-300 rounded-lg" />
        <div className="h-16 bg-base-300 rounded-lg" />
        <div className="h-16 bg-base-300 rounded-lg" />
        <div className="h-32 bg-base-300 rounded-lg" />
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const buildHref = (path: string) =>
    queryString ? `${path}?${queryString}` : path;

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Daily Login Streak */}
      <DailyLoginStreak status={status} />

      {/* Challenges Summary */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Challenges</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-base-800">
              {totalStats.completed}/{totalStats.total} Completed
            </span>
            <span className="text-base-800">|</span>
            <span className="text-brand-100">
              {totalStats.xpEarned?.toLocaleString?.()}/
              {totalStats.xpAvailable?.toLocaleString?.()} XP
            </span>
          </div>
        </div>

        {/* Basic Challenges Link */}
        <Link href={buildHref(`${basePath}/challenges/basic`)}>
          <div
            className={cn(
              `flex items-center justify-between p-4 rounded-lg border
              border-base-400 bg-base-300/50`,
              "transition-all hover:border-base-600 cursor-pointer",
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-base-800">
                {basicStats.completed}/{basicStats.total}
              </span>
              <span className="text-white text-lg">Basic Challenges</span>
            </div>
            <RiArrowRightSLine className="w-5 h-5 text-base-800" />
          </div>
        </Link>

        {/* Advanced Challenges Link */}
        <Link href={buildHref(`${basePath}/challenges/advanced`)}>
          <div
            className={cn(
              `flex items-center justify-between p-4 rounded-lg border
              border-base-400 bg-base-300/50`,
              "transition-all hover:border-base-600 cursor-pointer",
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-base-800">
                {advancedStats.completed}/{advancedStats.total}
              </span>
              <span className="text-white text-lg">Advanced Challenges</span>
            </div>
            <RiArrowRightSLine className="w-5 h-5 text-base-800" />
          </div>
        </Link>
      </div>

      {/* Daily Challenges */}
      {dailyChallengesData && dailyChallengesData.challenges.length > 0 && (
        <ChallengeSection
          title="Daily Challenges"
          challenges={dailyChallengesData.challenges}
          completedCount={dailyChallengesData.completedCount}
          totalCount={dailyChallengesData.totalCount}
          totalXpEarned={dailyChallengesData.totalXpEarned}
          totalXpAvailable={dailyChallengesData.totalXpAvailable}
          defaultExpanded={true}
          collapsible={false}
        />
      )}
    </div>
  );
};
