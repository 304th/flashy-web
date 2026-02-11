"use client";

import { useMemo } from "react";
import { ChallengeCard } from "../challenge-card";
import { useChallenges } from "../../queries/use-challenges";
import { GoBackButton } from "@/components/ui/go-back-button";

export const BasicChallenges = () => {
  const { data: challengesData, query: challengesQuery } = useChallenges();

  const basicChallenges = useMemo(() => {
    if (!challengesData?.challenges) return [];
    return challengesData.challenges.filter((c) => c.type === "basic");
  }, [challengesData]);

  const stats = useMemo(() => {
    return {
      completed: basicChallenges.filter((c) => c.isClaimed).length,
      total: basicChallenges.length,
      xpEarned: basicChallenges
        .filter((c) => c.isClaimed)
        .reduce((sum, c) => sum + c.xpReward, 0),
      xpAvailable: basicChallenges.reduce((sum, c) => sum + c.xpReward, 0),
    };
  }, [basicChallenges]);

  if (challengesQuery.isLoading) {
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
      <div className="flex w-fit">
        <GoBackButton/>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Basic Challenges</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-base-800">
            {stats.completed}/{stats.total} Completed
          </span>
          <span className="text-base-800">|</span>
          <span className="text-brand-100">
            {stats.xpEarned.toLocaleString()}/{stats.xpAvailable.toLocaleString()}{" "}
            XP
          </span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {basicChallenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge}/>
        ))}
      </div>
    </div>
  );
};
