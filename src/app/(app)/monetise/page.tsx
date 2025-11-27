"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MonetiseStatsCard,
  MonetiseFilterTabs,
  OpportunitiesGrid,
  SortSelect,
  useOpportunities,
  type FilterType,
  type SortOption,
} from "@/features/monetise";
import { DashboardIcon } from "@/components/ui/icons/dashboard";
import { SettingsIcon } from "@/components/ui/icons/settings";
import { WatchlistIcon } from "@/components/ui/icons/watchlist";
import { useWishlistStore } from "@/stores";

export default function MonetisePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("a-z");

  const { wishlistedIds } = useWishlistStore();

  // Fetch opportunities based on filter
  const { data, query } = useOpportunities({
    type: activeFilter === "all" ? undefined : activeFilter,
    sortBy:
      sortBy === "a-z" || sortBy === "z-a"
        ? undefined
        : sortBy === "newest"
          ? "createdAt"
          : "deadline",
    sortOrder: sortBy === "z-a" ? "desc" : "asc",
  });

  const isLoading = query.isLoading;

  const opportunities = useMemo(() => {
    if (!data) {
      return [];
    }

    const allOpportunities = data.map((opportunity: Opportunity) => ({
      ...opportunity,
      imageUrl: opportunity.brandLogo || "/placeholder-opportunity.jpg",
    }));

    if (sortBy === "a-z") {
      allOpportunities.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "z-a") {
      allOpportunities.sort((a, b) => b.title.localeCompare(a.title));
    }

    return allOpportunities;
  }, [data, sortBy]);

  const handleOpportunityClick = (id: string) => {
    router.push(`/monetise/opportunity?id=${id}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-page">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MonetiseStatsCard
          title="Your Dashboard"
          icon={<DashboardIcon />}
          link="/monetise/creator-dashboard"
        />
        <MonetiseStatsCard
          title="Active Agreements"
          icon={<SettingsIcon />}
          count={0}
          link="/monetise/creator-dashboard/agreements"
        />
        <MonetiseStatsCard
          title="Favourites"
          icon={<WatchlistIcon />}
          count={wishlistedIds.size}
          link="/monetise/creator-dashboard/favourites"
        />
      </div>
      <div className="flex items-center justify-between">
        <MonetiseFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video rounded-lg bg-base-400 animate-pulse" />
              <div className="h-4 bg-base-400 rounded animate-pulse" />
              <div className="h-3 bg-base-400 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <OpportunitiesGrid
          opportunities={opportunities}
          onOpportunityClick={handleOpportunityClick}
        />
      )}
    </div>
  );
}
