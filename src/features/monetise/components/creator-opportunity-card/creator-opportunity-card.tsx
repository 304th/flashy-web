"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

interface CreatorOpportunityCardProps {
  creatorOpportunity: CreatorOpportunity;
  opportunity: Opportunity;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function CreatorOpportunityCard({
  creatorOpportunity,
  opportunity,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
}: CreatorOpportunityCardProps) {
  const formatEndDate = (endDate: string) => {
    const date = new Date(endDate);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const isExpiringSoon = (endDate: string) => {
    const endDateObj = new Date(endDate);
    const now = new Date();
    const daysUntilEnd = Math.ceil(
      (endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilEnd <= 7 && daysUntilEnd >= 0;
  };

  const getStatusColor = (status: CreatorOpportunityStatus) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-500";
      case "submitted":
      case "under-review":
        return "bg-blue-500";
      case "rejected":
      case "expired":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const typeLabel =
    opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1);

  return (
    <div
      className="flex flex-col group cursor-pointer gap-3"
      onClick={() => onClick?.(creatorOpportunity._id)}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <span className="text-xs text-white/90 font-medium">
            Campaign Value | {opportunity.compensation}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/90">
            {formatEndDate(opportunity.endDate)}
          </span>
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              getStatusColor(creatorOpportunity.status),
            )}
          />
        </div>
      </div>

      <div
        className="relative aspect-video rounded-lg overflow-hidden bg-base-400"
      >
        {opportunity.brandLogo ? (
          <Image
            src={opportunity.brandLogo}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-base-600">
            No image
          </div>
        )}

        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(opportunity._id);
          }}
          className={cn(
            `!p-0 aspect-square absolute bottom-3 right-3 rounded-md
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

      <div className="flex flex-col gap-2">
        <h3 className="text-base text-white font-medium">
          {opportunity.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="!bg-base-300 !border-base-400 text-xs">
            {opportunity.brandName}
          </Tag>
          <Tag className="!bg-base-300 !border-base-400 text-xs">
            {opportunity.category}
          </Tag>
          <Tag className="!bg-base-300 !border-base-400 text-xs">
            {typeLabel}
          </Tag>
        </div>
      </div>
    </div>
  );
}
