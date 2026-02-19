"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  OpportunityCard,
  useOpportunitiesByIds,
  SortSelect,
  type SortOption,
} from "@/features/monetise";
import { useWishlistStore } from "@/stores";

export default function FavouritesPage() {
  const router = useRouter();
  const { wishlistedIds, toggleWishlist, isWishlisted } = useWishlistStore();
  const [sortBy, setSortBy] = useState<SortOption>("a-z");

  const ids = useMemo(() => Array.from(wishlistedIds), [wishlistedIds]);

  const { data: opportunities, isLoading } = useOpportunitiesByIds(ids);

  const sortedOpportunities = useMemo(() => {
    if (!opportunities) return [];

    const sorted = [...opportunities];

    switch (sortBy) {
      case "a-z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "endDate":
        sorted.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
        );
        break;
    }

    return sorted;
  }, [opportunities, sortBy]);

  const handleOpportunityClick = (id: string) => {
    router.push(`/monetise/opportunity?id=${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div
                  className="aspect-video bg-base-400 rounded-lg animate-pulse"
                />
                <div className="h-5 bg-base-400 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-base-400 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </>
        ) : sortedOpportunities.length > 0 ? (
          sortedOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity._id}
              opportunity={opportunity}
              isWishlisted={isWishlisted(opportunity._id)}
              onWishlistToggle={toggleWishlist}
              onClick={handleOpportunityClick}
            />
          ))
        ) : (
          <div
            className="col-span-4 flex flex-col items-center justify-center
              py-12 text-base-700"
          >
            <p>No favourites yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/monetise")}
            >
              Browse Opportunities
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
