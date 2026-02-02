"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChallengeCard } from "../challenge-card";
import { useChallenges } from "../../queries/use-challenges";
import { RiArrowLeftLine } from "@remixicon/react";

export const BasicChallenges = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryString = searchParams.toString();
  const basePath = pathname.startsWith("/profile") ? "/profile" : "/channel";

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

  const buildHref = (path: string) =>
    queryString ? `${path}?${queryString}` : path;

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
      {/* Back Link */}
      <Link
        href={buildHref(`${basePath}/challenges`)}
        className="flex items-center gap-2 text-sm text-base-500 hover:text-white transition-colors w-fit"
      >
        <RiArrowLeftLine className="w-4 h-4" />
        <span>Go Back</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Basic Challenges</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-base-500">
            {stats.completed}/{stats.total} Completed
          </span>
          <span className="text-base-500">|</span>
          <span className="text-brand-100">
            {stats.xpEarned.toLocaleString()}/{stats.xpAvailable.toLocaleString()}{" "}
            XP
          </span>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {basicChallenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};
