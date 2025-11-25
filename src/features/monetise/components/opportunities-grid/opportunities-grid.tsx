"use client";

import { OpportunityCard } from "@/features/monetise";
import { useWishlistStore } from "@/stores";

interface OpportunitiesGridProps {
  opportunities: Opportunity[];
  onOpportunityClick?: (id: string) => void;
}

export function OpportunitiesGrid({
  opportunities,
  onOpportunityClick,
}: OpportunitiesGridProps) {
  const { wishlistedIds, toggleWishlist } = useWishlistStore();

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
          key={opportunity._id}
          opportunity={opportunity}
          isWishlisted={wishlistedIds.has(opportunity._id)}
          onWishlistToggle={() => {
            toggleWishlist(opportunity._id);
          }}
          onClick={onOpportunityClick}
        />
      ))}
    </div>
  );
}