"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  CreatorOpportunityCard,
  useMyOpportunities,
} from "@/features/monetise";
import { TimeRange } from "@/features/monetise/collections/my-opportunities";
import { useWishlistStore } from "@/stores";

type StatusFilter = "all" | CreatorOpportunityStatus;

export default function CreatorDashboardAgreementsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeRange>("past-12-months");
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const { data: creatorOpportunities, query } = useMyOpportunities({
    status: statusFilter === "all" ? undefined : statusFilter,
    timeRange: timeFilter,
  });
  const isLoading = query.isLoading;

  const handleOpportunityClick = (creatorOpportunityId: string) => {
    const creatorOpp = creatorOpportunities?.find(
      (co) => co._id === creatorOpportunityId,
    );
    if (creatorOpp) {
      const oppId =
        typeof creatorOpp.opportunityId === "string"
          ? creatorOpp.opportunityId
          : creatorOpp.opportunityId._id;
      router.push(`/monetise/opportunity?id=${oppId}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <Select.Root
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          variant="compact"
          size="xsmall"
        >
          <Select.Item value="all">All</Select.Item>
          <Select.Item value="accepted">Active</Select.Item>
          <Select.Item value="pending-deliverables">
            Pending Deliverables
          </Select.Item>
          <Select.Item value="submitted">Submitted</Select.Item>
          <Select.Item value="approved">Approved</Select.Item>
          <Select.Item value="completed">Completed</Select.Item>
          <Select.Item value="rejected">Rejected</Select.Item>
          <Select.Item value="expired">Expired</Select.Item>
        </Select.Root>

        <Select.Root
          value={timeFilter}
          onValueChange={(value) => setTimeFilter(value as TimeRange)}
          variant="compact"
          size="xsmall"
        >
          <Select.Item value="past-12-months">Past 12 Months</Select.Item>
          <Select.Item value="past-6-months">Past 6 Months</Select.Item>
          <Select.Item value="past-3-months">Past 3 Months</Select.Item>
          <Select.Item value="past-month">Past Month</Select.Item>
        </Select.Root>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-4 bg-base-400 rounded animate-pulse" />
                <div
                  className="aspect-video bg-base-400 rounded-lg animate-pulse"
                />
                <div className="h-5 bg-base-400 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-base-400 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </>
        ) : creatorOpportunities && creatorOpportunities.length > 0 ? (
          creatorOpportunities.map((creatorOpp) => {
            const opportunity =
              typeof creatorOpp.opportunityId === "string"
                ? null
                : creatorOpp.opportunityId;

            if (!opportunity) return null;

            return (
              <CreatorOpportunityCard
                key={creatorOpp._id}
                creatorOpportunity={creatorOpp}
                opportunity={opportunity}
                isWishlisted={isWishlisted(opportunity._id)}
                onWishlistToggle={toggleWishlist}
                onClick={handleOpportunityClick}
              />
            );
          })
        ) : (
          <div
            className="col-span-4 flex flex-col items-center justify-center
              py-12 text-base-700"
          >
            <p>No agreements yet</p>
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
    </>
  );
}
