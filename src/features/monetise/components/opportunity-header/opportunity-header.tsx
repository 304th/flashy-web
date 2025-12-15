"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelMessageButton } from "@/features/channels/components/channel-header/channel-message-button";
import {useMemo} from "react";

interface OpportunityHeaderProps {
  opportunity: Opportunity
  title: string;
  brandName: string;
  category: string;
  type: string;
  description: string;
  isEligible?: boolean;
  isFavourited?: boolean;
  hasApplied?: boolean;
  onToggleFavourite?: () => void;
}

export function OpportunityHeader({
  opportunity,
  title,
  brandName,
  category,
  type,
  description,
  isEligible = false,
  isFavourited = false,
  hasApplied = false,
  onToggleFavourite,
}: OpportunityHeaderProps) {
  const businessCreator = useMemo(() => {
    return {
      username: '',
      userimage: '',
      fbId: opportunity.createdBy,
    }
  }, [opportunity])

  return (
    <div className="flex flex-col justify-between grow-1 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {isEligible && (
            <div className="flex items-center gap-2 text-brand-100">
              <Check className="w-4 h-4" />
              <span className="text-sm">
            {
              hasApplied ? 'Applied' : 'You Are Eligible For This Opportunity'
            }
          </span>
            </div>
          )}

          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-400">{brandName}</span>
            <span className="text-base-600">|</span>
            <span className="text-base-800">{category}</span>
            <span className="text-base-600">|</span>
            <span className="text-base-800">{type}</span>
          </div>
        </div>

        <p className="text-white leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {
          hasApplied && (
            <ChannelMessageButton title="Contact" variant="default" channel={businessCreator} />
          )
        }
        <Button
          variant="outline"
          onClick={onToggleFavourite}
          className="gap-2"
        >
          <Star
            className={`w-4 h-4 ${isFavourited ? "text-yellow-400" : ""}`}
            fill={isFavourited ? "currentColor" : "none"}
          />
          {isFavourited ? "Remove From Favourites" : "Add To Favourites"}
        </Button>
      </div>
    </div>
  );
}
