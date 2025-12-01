"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface BusinessOpportunityCardProps {
  opportunity: {
    _id: string;
    title: string;
    brandLogo?: string;
    campaignValue: string;
    deadline: string;
    isExpiringSoon?: boolean;
    tags: string[];
  };
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function BusinessOpportunityCard({
  opportunity,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
}: BusinessOpportunityCardProps) {
  return (
    <div
      className="flex flex-col group cursor-pointer gap-3"
      onClick={() => onClick?.(opportunity._id)}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <span className="text-xs text-white/90 font-medium">
            Campaign Value | {opportunity.campaignValue}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/90">{opportunity.deadline}</span>
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              opportunity.isExpiringSoon ? "bg-red-500" : "bg-green-500",
            )}
          />
        </div>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden bg-base-400">
        {opportunity.brandLogo && (
          <Image
            src={opportunity.brandLogo}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}

        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(opportunity._id);
          }}
          className={cn(
            "!p-0 aspect-square absolute bottom-3 right-3 rounded-md transition-colors",
            isWishlisted ? "text-yellow-400" : "text-white/70 hover:text-white",
          )}
        >
          <Star
            className="w-4 h-4"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base text-white font-medium">{opportunity.title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {opportunity.tags.map((tag, index) => (
            <Tag key={index} className="!bg-base-300 !border-base-400 text-xs">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
