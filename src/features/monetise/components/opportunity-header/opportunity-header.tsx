"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpportunityHeaderProps {
  title: string;
  brandName: string;
  category: string;
  type: string;
  description: string;
  isEligible?: boolean;
  isFavourited?: boolean;
  onToggleFavourite?: () => void;
}

export function OpportunityHeader({
  title,
  brandName,
  category,
  type,
  description,
  isEligible = false,
  isFavourited = false,
  onToggleFavourite,
}: OpportunityHeaderProps) {
  return (
    <div className="space-y-4">
      {isEligible && (
        <div className="flex items-center gap-2 text-green-400">
          <Check className="w-4 h-4" />
          <span className="text-sm">Your Are Eligible For This Opportunity</span>
        </div>
      )}

      <h1 className="text-2xl font-bold text-white">{title}</h1>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-purple-400">{brandName}</span>
        <span className="text-base-600">|</span>
        <span className="text-base-800">{category}</span>
        <span className="text-base-600">|</span>
        <span className="text-base-800">{type}</span>
      </div>

      <p className="text-sm text-base-800 leading-relaxed">{description}</p>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFavourite}
        className="gap-2"
      >
        <Star
          className="w-4 h-4"
          fill={isFavourited ? "currentColor" : "none"}
        />
        {isFavourited ? "Remove From Favourites" : "Add To Favourites"}
      </Button>
    </div>
  );
}
