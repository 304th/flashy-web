"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";
import {
  CreatorDashboardTabs,
  OpportunityCard,
  useOpportunitiesByIds,
} from "@/features/monetise";
import { useWishlistStore } from "@/stores";

export default function FavouritesPage() {
  const router = useRouter();
  const { wishlistedIds, toggleWishlist, isWishlisted } = useWishlistStore();

  const ids = useMemo(() => Array.from(wishlistedIds), [wishlistedIds]);

  const { data: opportunities, isLoading } = useOpportunitiesByIds(ids);

  const handleOpportunityClick = (id: string) => {
    router.push(`/monetise/opportunity?id=${id}`);
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <GoBackButton />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
        {/*<div className="flex items-center gap-2">*/}
        {/*  <Button>Withdraw Funds</Button>*/}
        {/*  <Button variant="secondary" size="icon">*/}
        {/*    <MoreVertical className="w-5 h-5" />*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

      <div className="flex items-center justify-between">
        <CreatorDashboardTabs />
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
        ) : opportunities && opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
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
