"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useClaimChallenge } from "../../mutations/use-claim-challenge";
import { getChallengeIcon } from "../../utils/challenge-icons";
import type { Challenge } from "../../types";
import { RiCheckLine } from "@remixicon/react";

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
  const iconSrc = getChallengeIcon(challenge.name);

  const handleClaim = () => {
    if (canClaim) {
      claimMutation.mutate({ challengeId: challenge.key });
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border border-base-400 bg-base-300/50",
        "transition-all hover:border-base-600",
        isClaimed && "pointer-events-none"
      )}
    >
      {/* Icon */}
      {iconSrc && (
        <div className="relative flex-shrink-0 w-10 h-10">
          <Image
            src={iconSrc}
            alt={challenge.name}
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
          {isClaimed && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-100 flex items-center justify-center">
              <RiCheckLine className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
      )}

      {/* Progress counter */}
      <span className={cn("text-sm text-base-800 flex-shrink-0", isClaimed && "text-brand-200")}>
        {challenge.currentValue ?? 0}/{challenge.targetValue ?? 1}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h4 className="text-lg font-medium text-white truncate">
          {challenge.name}
        </h4>
        <p className="text-xs text-base-800 truncate">{challenge.description}</p>
        {/* Progress bar for in-progress challenges */}
        {!isClaimed &&
          challenge.progress !== undefined &&
          challenge.progress > 0 &&
          challenge.progress < 100 && (
            <div className="mt-2 h-1.5 bg-base-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-100 rounded-full transition-all"
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          )}
      </div>

      {/* XP Badge / Claim Button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {showClaimButton && canClaim ? (
          <Button
            size="sm"
            onClick={handleClaim}
            pending={claimMutation.isPending}
            className="min-w-[70px]"
          >
            Claim {challenge.xpReward} XP
          </Button>
        ) : (
          <span
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-md",
              "text-brand-100 bg-brand-100/10"
            )}
          >
            {isClaimed ? "Claimed" : `${challenge.xpReward} XP`}
          </span>
        )}
      </div>
    </div>
  );
};
