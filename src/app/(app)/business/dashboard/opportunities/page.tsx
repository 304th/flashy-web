"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BusinessOpportunityCard } from "@/features/business/components/business-opportunity-card/business-opportunity-card";
import { Select } from "@/components/ui/select";
import { CreateOpportunityIcon } from "@/components/ui/icons/create-opportunity";
import { useSponsorOpportunities } from "@/features/business";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Loadable } from "@/components/ui/loadable";
import { NotFound } from "@/components/ui/not-found";
import { useQueryClient } from "@tanstack/react-query";

const formatEndDate = (endDate: string) => {
  const date = new Date(endDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const isExpiringSoon = (endDate: string) => {
  const endDateObj = new Date(endDate);
  const now = new Date();
  const daysUntilEnd = Math.ceil(
    (endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysUntilEnd <= 7 && daysUntilEnd >= 0;
};

const getDateRangeStart = (timeFilter: string): Date => {
  const now = new Date();
  switch (timeFilter) {
    case "past-month":
      now.setMonth(now.getMonth() - 1);
      break;
    case "past-3-months":
      now.setMonth(now.getMonth() - 3);
      break;
    case "past-6-months":
      now.setMonth(now.getMonth() - 6);
      break;
    case "past-12-months":
    default:
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now;
};

const filterByDateRange = (
  opportunities: Opportunity[],
  timeFilter: string,
): Opportunity[] => {
  const dateRangeStart = getDateRangeStart(timeFilter);

  return opportunities.filter((opportunity) => {
    const opportunityDate = new Date(opportunity.createdAt);
    return opportunityDate >= dateRangeStart;
  });
};

type StatusFilter = "all" | OpportunityStatus;

export default function BusinessDashboardOpportunitiesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");
  const [wishlistedOpportunities, setWishlistedOpportunities] = useState<
    Set<string>
  >(new Set());

  const { data: opportunities, query } = useSponsorOpportunities({
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const isLoading = query.isLoading;

  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];

    const dateRangeStart = getDateRangeStart(timeFilter);

    return opportunities.filter((opportunity) => {
      const createdAt = new Date(opportunity.createdAt);
      return createdAt >= dateRangeStart;
    });
  }, [opportunities, timeFilter]);

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
      {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">*/}
      {/*  <StatCard*/}
      {/*    title="Balance"*/}
      {/*    value={mockStats.balance.value}*/}
      {/*    changePercentage={mockStats.balance.change}*/}
      {/*  />*/}
      {/*  <StatCard*/}
      {/*    title="Distributors"*/}
      {/*    value={mockStats.distributors.value}*/}
      {/*    changePercentage={mockStats.distributors.change}*/}
      {/*  />*/}
      {/*  <StatCard*/}
      {/*    title="Pending Commissions"*/}
      {/*    value={mockStats.pendingCommissions.value}*/}
      {/*    changePercentage={mockStats.pendingCommissions.change}*/}
      {/*  />*/}
      {/*  <StatCard*/}
      {/*    title="Paid Commissions"*/}
      {/*    value={mockStats.paidCommissions.value}*/}
      {/*    changePercentage={mockStats.paidCommissions.change}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className="flex gap-3 items-center justify-between">
        <div>
          <Link href="/business/opportunities/create">
            <Button>
              <PlusIcon />
              Create Opportunity
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Select.Root
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            variant="compact"
            size="xsmall"
          >
            <Select.Item value="all">All Status</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="paused">Paused</Select.Item>
            <Select.Item value="expired">Expired</Select.Item>
          </Select.Root>

          <Select.Root
            value={timeFilter}
            onValueChange={setTimeFilter}
            variant="compact"
            size="xsmall"
          >
            <Select.Item value="past-12-months">Past 12 Months</Select.Item>
            <Select.Item value="past-6-months">Past 6 Months</Select.Item>
            <Select.Item value="past-3-months">Past 3 Months</Select.Item>
            <Select.Item value="past-month">Past Month</Select.Item>
          </Select.Root>
        </div>
      </div>

      <div>
        <Loadable
          queries={[query] as any}
          defaultFallbackClassname="flex w-full justify-center items-center"
        >
          {() => {
            return filteredOpportunities.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredOpportunities.map((opportunity) => (
                  <BusinessOpportunityCard
                    key={opportunity._id}
                    opportunity={{
                      _id: opportunity._id,
                      title: opportunity.title,
                      brandLogo: opportunity.brandLogo,
                      campaignValue: opportunity.compensation,
                      deadline: formatEndDate(opportunity.endDate),
                      isExpiringSoon: isExpiringSoon(opportunity.endDate),
                      tags: [
                        opportunity.brandName,
                        opportunity.category,
                        opportunity.type,
                      ],
                    }}
                    isWishlisted={wishlistedOpportunities.has(opportunity._id)}
                    onWishlistToggle={handleWishlistToggle}
                    onClick={(id) =>
                      router.push(`/business/opportunities?id=${id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <NotFound>No opportunities found</NotFound>
            );
          }}
        </Loadable>
      </div>
    </div>
  );
}
