"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { capitalize } from "media-chrome/utils/utils";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function OpportunityCard({
  opportunity,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
}: OpportunityCardProps) {
  const typeLabel =
    opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1);

  const totalMediaCount = (opportunity.mediaAssets?.length || 0) + (opportunity.brandLogo ? 1 : 0);

  return (
    <div
      className="flex flex-col group cursor-pointer gap-2"
      onClick={() => onClick?.(opportunity._id)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={opportunity.brandLogo!}
          alt={opportunity.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {totalMediaCount > 1 && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-white text-xs font-medium">
              +{totalMediaCount - 1} more
            </span>
          </div>
        )}
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(opportunity._id);
          }}
          className={cn(
            `!p-0 aspect-square absolute bottom-2 right-2 rounded-md
            transition-colors`,
            isWishlisted ? "text-yellow-400" : "text-white/70 hover:text-white",
          )}
        >
          <Star
            className="w-4 h-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg text-white truncate">{opportunity.title}</h3>
        <div className="flex items-center gap-1">
          <Tag className="!bg-base-300 !border-base-400">
            {opportunity.brandName}
          </Tag>
          <Tag className="!bg-base-300 !border-base-400">
            {capitalize(opportunity.category)}
          </Tag>
          <Tag className="!bg-base-300 !border-base-400">{typeLabel}</Tag>
        </div>

        {/*<p className="text-xs text-purple-400">{typeLabel}</p>*/}
      </div>
    </div>
  );
}
