"use client";

import { OpportunityCard } from "./opportunity-card";

interface OpportunityData {
  id: string;
  title: string;
  brandName: string;
  brandLogo?: string;
  imageUrl: string;
  category: string;
  type: "sponsorship" | "partnership" | "affiliate";
  isWishlisted?: boolean;
}

interface OpportunitiesGridProps {
  opportunities: OpportunityData[];
  onWishlistToggle?: (id: string) => void;
  onOpportunityClick?: (id: string) => void;
}

export function OpportunitiesGrid({
  opportunities,
  onWishlistToggle,
  onOpportunityClick,
}: OpportunitiesGridProps) {
  if (opportunities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-base-800">No opportunities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          {...opportunity}
          onWishlistToggle={onWishlistToggle}
          onClick={onOpportunityClick}
        />
      ))}
    </div>
  );
}

export type { OpportunityData };
