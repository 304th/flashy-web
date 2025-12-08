"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/features/business/components/stat-card/stat-card";
import { BusinessOpportunityCard } from "@/features/business/components/business-opportunity-card/business-opportunity-card";
import { Select } from "@/components/ui/select";
import { CreateOpportunityIcon } from "@/components/ui/icons/create-opportunity";
import { useSponsorOpportunities } from "@/features/business";

// Mock data - replace with real data from API
const mockStats = {
  balance: { value: "$17,032", change: "+1,205%" },
  distributors: { value: "10,058", change: "+1,500%" },
  pendingCommissions: { value: "$1,000", change: "+3,000%" },
  paidCommissions: { value: "$13,000", change: "+1,074%" },
};

const formatDeadline = (deadline: string) => {
  const date = new Date(deadline);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const isExpiringSoon = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
};

export default function BusinessDashboardOpportunitiesPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");
  const [wishlistedOpportunities, setWishlistedOpportunities] = useState<
    Set<string>
  >(new Set());

  const { data: opportunities, query } = useSponsorOpportunities();
  const isLoading = query.isLoading;

  const handleWishlistToggle = (opportunityId: string) => {
    setWishlistedOpportunities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(opportunityId)) {
        newSet.delete(opportunityId);
      } else {
        newSet.add(opportunityId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Balance"
          value={mockStats.balance.value}
          changePercentage={mockStats.balance.change}
        />
        <StatCard
          title="Distributors"
          value={mockStats.distributors.value}
          changePercentage={mockStats.distributors.change}
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

      <div className="flex gap-3 justify-end">
        <Select.Root
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          variant="compact"
        >
          <Select.Item value="all">All</Select.Item>
          <Select.Item value="active">Active</Select.Item>
          <Select.Item value="pending">Pending</Select.Item>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-lg
            bg-base-300 p-6 cursor-pointer hover:bg-base-400 transition-colors"
          onClick={() => router.push("/business/opportunities/create")}
        >
          <div className="p-4 rounded-lg">
            <CreateOpportunityIcon />
          </div>
          <span className="text-lg text-white font-medium">
            Create Opportunity
          </span>
        </div>

        {isLoading ? (
          <div className="col-span-3 flex items-center justify-center py-12 text-base-700">
            Loading opportunities...
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <BusinessOpportunityCard
              key={opportunity._id}
              opportunity={{
                _id: opportunity._id,
                title: opportunity.title,
                brandLogo: opportunity.brandLogo,
                campaignValue: opportunity.compensation,
                deadline: formatDeadline(opportunity.deadline),
                isExpiringSoon: isExpiringSoon(opportunity.deadline),
                tags: [opportunity.brandName, opportunity.category, opportunity.type],
              }}
              isWishlisted={wishlistedOpportunities.has(opportunity._id)}
              onWishlistToggle={handleWishlistToggle}
              onClick={(id) => router.push(`/business/opportunities?id=${id}`)}
            />
          ))
        ) : (
          <div className="col-span-3 flex items-center justify-center py-12 text-base-700">
            No opportunities yet
          </div>
        )}
      </div>
    </div>
  );
}
