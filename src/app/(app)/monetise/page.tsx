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
  type OpportunityData,
} from "@/features/monetise";

export default function MonetisePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("a-z");
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  // Fetch opportunities based on filter
  const { data, query } = useOpportunities({
    type: activeFilter === "all" ? undefined : activeFilter,
    sortBy: sortBy === "a-z" || sortBy === "z-a" ? undefined : sortBy === "newest" ? "createdAt" : "deadline",
    sortOrder: sortBy === "z-a" ? "desc" : "asc",
  });

  const isLoading = query.isLoading;

  // Transform API data to component format
  const opportunities: OpportunityData[] = useMemo(() => {
    if (!data) return [];

    const allOpportunities = data.map((opp: Opportunity) => ({
      id: opp._id,
      title: opp.title,
      brandName: opp.brandName,
      brandLogo: opp.brandLogo,
      imageUrl: opp.brandLogo || "/placeholder-opportunity.jpg",
      category: opp.eligibility?.niches?.[0] || "General",
      type: opp.type,
      isWishlisted: wishlistedIds.has(opp._id),
    }));

    // Sort alphabetically if needed
    if (sortBy === "a-z") {
      allOpportunities.sort((a: OpportunityData, b: OpportunityData) => a.title.localeCompare(b.title));
    } else if (sortBy === "z-a") {
      allOpportunities.sort((a: OpportunityData, b: OpportunityData) => b.title.localeCompare(a.title));
    }

    return allOpportunities;
  }, [data, wishlistedIds, sortBy]);

  const handleWishlistToggle = (id: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOpportunityClick = (id: string) => {
    router.push(`/monetise/opportunity?id=${id}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-page">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MonetiseStatsCard
          title="Your Dashboard"
          isLocked={true}
        />
        <MonetiseStatsCard
          title="Active Agreements"
          count={0}
          isLocked={true}
        />
        <MonetiseStatsCard
          title="Wishlist"
          count={wishlistedIds.size}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <MonetiseFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SortSelect value={sortBy} onChange={setSortBy} />
      </div>

      {/* Opportunities Grid */}
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
          onWishlistToggle={handleWishlistToggle}
          onOpportunityClick={handleOpportunityClick}
        />
      )}
    </div>
  );
}
