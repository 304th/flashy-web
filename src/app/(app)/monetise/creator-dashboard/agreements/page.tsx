"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/features/business/components/stat-card/stat-card";
import {
  CreatorDashboardTabs,
  CreatorOpportunityCard,
  useMyOpportunities,
} from "@/features/monetise";
import { useWishlistStore } from "@/stores";

// Mock stats - replace with real data from API
const mockStats = {
  balance: { value: "$17,032", change: "+1,205%" },
  revenue: { value: "$27,300", change: "+1,500%" },
  pendingCommissions: { value: "$1,000", change: "+3,000%" },
  paidCommissions: { value: "$13,000", change: "+1,074%" },
};

export default function CreatorDashboardAgreementsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const { data: creatorOpportunities, query } = useMyOpportunities();
  const isLoading = query.isLoading;

  const handleOpportunityClick = (creatorOpportunityId: string) => {
    // Find the opportunity ID from the creator opportunity
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
    <div className="flex flex-col gap-6 py-6">
      <div>
        <GoBackButton />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-brand-100 hover:bg-brand-200 text-black">
            Withdraw Funds
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <CreatorDashboardTabs />
        <div className="flex items-center gap-3">
          <Select.Root
            value={statusFilter}
            onValueChange={setStatusFilter}
            variant="compact"
          >
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="accepted">Active</Select.Item>
            <Select.Item value="submitted">Submitted</Select.Item>
            <Select.Item value="approved">Approved</Select.Item>
            <Select.Item value="completed">Completed</Select.Item>
          </Select.Root>

          <Select.Root
            value={timeFilter}
            onValueChange={setTimeFilter}
            variant="compact"
          >
            <Select.Item value="past-12-months">Past 12 Months</Select.Item>
            <Select.Item value="past-6-months">Past 6 Months</Select.Item>
            <Select.Item value="past-3-months">Past 3 Months</Select.Item>
            <Select.Item value="past-month">Past Month</Select.Item>
          </Select.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Balance"
          value={mockStats.balance.value}
          changePercentage={mockStats.balance.change}
        />
        <StatCard
          title="Revenue"
          value={mockStats.revenue.value}
          changePercentage={mockStats.revenue.change}
        />
        <StatCard
          title="Pending Commissions"
          value={mockStats.pendingCommissions.value}
          changePercentage={mockStats.pendingCommissions.change}
        />
        <StatCard
          title="Paid Commissions"
          value={mockStats.paidCommissions.value}
          changePercentage={mockStats.paidCommissions.change}
        />
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
    </div>
  );
}
