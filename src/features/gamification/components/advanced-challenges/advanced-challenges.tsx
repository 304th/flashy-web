"use client";

import { useMemo } from "react";
import { ChallengeCard } from "../challenge-card";
import { useChallenges } from "../../queries/use-challenges";
import { GoBackButton } from "@/components/ui/go-back-button";

export const AdvancedChallenges = () => {
  const { data: challengesData, query: challengesQuery } = useChallenges();

  const advancedChallenges = useMemo(() => {
    if (!challengesData?.challenges) return [];
    return challengesData.challenges.filter((c) => c.type === "advanced");
  }, [challengesData]);

  // Group by category
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof advancedChallenges> = {};
    advancedChallenges.forEach((challenge) => {
      const category = challenge.category || "other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(challenge);
    });
    // Sort each category by tier
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => (a.tier || 0) - (b.tier || 0));
    });
    return groups;
  }, [advancedChallenges]);

  const stats = useMemo(() => {
    return {
      completed: advancedChallenges.filter((c) => c.isClaimed).length,
      total: advancedChallenges.length,
      xpEarned: advancedChallenges
        .filter((c) => c.isClaimed)
        .reduce((sum, c) => sum + c.xpReward, 0),
      xpAvailable: advancedChallenges.reduce((sum, c) => sum + c.xpReward, 0),
    };
  }, [advancedChallenges]);

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (challengesQuery.isPending) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-8 w-32 bg-base-300 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-20 bg-base-300 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Back Link */}
      <div className="flex w-fit">
        <GoBackButton />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Advanced Challenges</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-base-800">
            {stats.completed}/{stats.total} Completed
          </span>
          <span className="text-base-800">|</span>
          <span className="text-brand-100">
            {stats.xpEarned.toLocaleString?.()}/
            {stats.xpAvailable.toLocaleString?.()} XP
          </span>
        </div>
      </div>

      {/* Challenges by Category */}
      {Object.entries(groupedByCategory).map(([category, challenges]) => (
        <div key={category} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-white">
            {formatCategoryName(category)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge._id} challenge={challenge} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
