"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useGamificationStatus } from "../../queries/use-gamification-status";

const RANK_ICONS: Record<string, string> = {
  Amethyst: "/images/ranks/amethyst.svg",
  Ruby: "/images/ranks/ruby.svg",
  Aquamarine: "/images/ranks/topaz.svg",
  Emerald: "/images/ranks/emerald.svg",
  Sapphire: "/images/ranks/sapphire.svg",
  Larimar: "/images/ranks/onyx.svg",
  Platinum: "/images/ranks/silver-gold.svg",
  MoonStone: "/images/ranks/moonstone.svg",
  Gold: "/images/ranks/diamond.svg",
  Opal: "/images/ranks/dark-matter-alt.svg",
  "Dark Matter": "/images/ranks/dark-matter.svg",
};

interface XpStatusBadgeProps {
  className?: string;
}

export const XpStatusBadge = ({ className }: XpStatusBadgeProps) => {
  const { data: status, query } = useGamificationStatus();

  if (query.isLoading || !status) {
    return null;
  }

  const rankIcon = RANK_ICONS[status.currentRank];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {rankIcon && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={rankIcon}
              alt={status.currentRank}
              width={28}
              height={28}
              className="flex-shrink-0 cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>{status.currentRank}</TooltipContent>
        </Tooltip>
      )}
      <span className="text-sm font-semibold text-brand-100">
        Lv. {status.currentLevel}
      </span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-base-400 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-100 rounded-full transition-all"
            style={{ width: `${status.levelProgress}%` }}
          />
        </div>
        <span className="text-xs text-base-800 whitespace-nowrap">
          {status.xpToNextLevel?.toLocaleString?.()} XP Remaining
        </span>
      </div>
    </div>
  );
};
