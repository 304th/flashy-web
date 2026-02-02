"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChallengeCard } from "../challenge-card";
import type { Challenge } from "../../types";
import { RiArrowRightSLine, RiArrowDownSLine } from "@remixicon/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChallengeSectionProps {
  title: string;
  challenges: Challenge[];
  completedCount: number;
  totalCount: number;
  totalXpEarned: number;
  totalXpAvailable: number;
  defaultExpanded?: boolean;
  collapsible?: boolean;
}

export const ChallengeSection = ({
  title,
  challenges,
  completedCount,
  totalCount,
  totalXpEarned,
  totalXpAvailable,
  defaultExpanded = false,
  collapsible = true,
}: ChallengeSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge._id} challenge={challenge} />
      ))}
    </div>
  );

  if (!collapsible) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-base-500">
              {completedCount}/{totalCount} Completed
            </span>
            <span className="text-base-500">|</span>
            <span className="text-brand-100">
              {totalXpEarned.toLocaleString()}/{totalXpAvailable.toLocaleString()}{" "}
              XP
            </span>
          </div>
        </div>
        {content}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-lg border border-base-400 bg-base-300/50",
            "transition-all hover:border-base-300 cursor-pointer"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-base-500">
              {completedCount}/{totalCount}
            </span>
            <span className="text-white font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            {isOpen ? (
              <RiArrowDownSLine className="w-5 h-5 text-base-500" />
            ) : (
              <RiArrowRightSLine className="w-5 h-5 text-base-500" />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>{content}</CollapsibleContent>
    </Collapsible>
  );
};
