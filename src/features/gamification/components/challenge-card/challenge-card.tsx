"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClaimChallenge } from "../../mutations/use-claim-challenge";
import type { Challenge } from "../../types";
import { RiTrophyLine, RiCheckLine } from "@remixicon/react";

interface ChallengeCardProps {
  challenge: Challenge;
  showClaimButton?: boolean;
}

export const ChallengeCard = ({
  challenge,
  showClaimButton = true,
}: ChallengeCardProps) => {
  const claimMutation = useClaimChallenge();

  const canClaim = challenge.isCompleted && !challenge.isClaimed;
  const isClaimed = challenge.isClaimed;

  const handleClaim = () => {
    if (canClaim) {
      claimMutation.mutate({ challengeId: challenge.key });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border border-base-400 bg-base-300/50",
        "transition-all hover:border-base-300",
        isClaimed && "opacity-60"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          isClaimed ? "bg-brand-100/20" : "bg-brand-100/10"
        )}
      >
        {isClaimed ? (
          <RiCheckLine className="w-5 h-5 text-brand-100" />
        ) : (
          <RiTrophyLine className="w-5 h-5 text-brand-100" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">
          {challenge.name}
        </h4>
        <p className="text-xs text-base-500 truncate">{challenge.description}</p>
        {/* Progress bar for in-progress challenges */}
        {!isClaimed && challenge.progress !== undefined && challenge.progress > 0 && challenge.progress < 100 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-base-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-100 rounded-full transition-all"
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
            <span className="text-xs text-base-500">
              {challenge.currentValue}/{challenge.targetValue}
            </span>
          </div>
        )}
      </div>

      {/* XP Badge / Claim Button */}
      <div className="flex items-center gap-2">
        {showClaimButton && canClaim ? (
          <Button
            size="sm"
            onClick={handleClaim}
            pending={claimMutation.isPending}
            className="min-w-[70px]"
          >
            Claim
          </Button>
        ) : (
          <span
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-md",
              isClaimed
                ? "text-brand-100 bg-brand-100/10"
                : "text-base-500 bg-base-400/50"
            )}
          >
            {challenge.xpReward} XP
          </span>
        )}
      </div>
    </div>
  );
};
