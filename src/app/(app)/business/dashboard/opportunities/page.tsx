"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { StatCard } from "@/features/business/components/stat-card/stat-card";
import { BusinessOpportunityCard } from "@/features/business/components/business-opportunity-card/business-opportunity-card";
import { Select } from "@/components/ui/select";
import {CreateOpportunityIcon} from "@/components/ui/icons/create-opportunity";

// Mock data - replace with real data from API
const mockStats = {
  balance: { value: "$17,032", change: "+1,205%" },
  distributors: { value: "10,058", change: "+1,500%" },
  pendingCommissions: { value: "$1,000", change: "+3,000%" },
  paidCommissions: { value: "$13,000", change: "+1,074%" },
};

const mockOpportunities = [
  {
    _id: "1",
    title: "Hemp Rolling Papers",
    brandLogo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    campaignValue: "$1000",
    deadline: "24/07/25",
    isExpiringSoon: false,
    tags: ["HempRoll", "Lifestyle", "Sponsorship"],
  },
  {
    _id: "2",
    title: "Hemp Rolling Papers",
    brandLogo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    campaignValue: "10%",
    deadline: "24/07/25",
    isExpiringSoon: false,
    tags: ["HempRoll", "Lifestyle", "Sponsorship"],
  },
  {
    _id: "3",
    title: "Hemp Rolling Papers",
    brandLogo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    campaignValue: "$1000",
    deadline: "24/07/25",
    isExpiringSoon: true,
    tags: ["HempRoll", "Lifestyle", "Sponsorship"],
  },
];

export default function BusinessDashboardOpportunitiesPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("past-12-months");
  const [wishlistedOpportunities, setWishlistedOpportunities] = useState<
    Set<string>
  >(new Set());

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
          className="flex flex-col items-center justify-center gap-4 rounded-lg bg-base-300 p-6  cursor-pointer hover:bg-base-400 transition-colors"
          onClick={() => router.push("/business/opportunities/create")}
        >
          <div className="p-4 rounded-lg">
            <CreateOpportunityIcon />
          </div>
          <span className="text-lg text-white font-medium">
            Create Agreement
          </span>
        </div>

        {mockOpportunities.map((opportunity) => (
          <BusinessOpportunityCard
            key={opportunity._id}
            opportunity={opportunity}
            isWishlisted={wishlistedOpportunities.has(opportunity._id)}
            onWishlistToggle={handleWishlistToggle}
            onClick={(id) => console.log("Clicked opportunity:", id)}
          />
        ))}
      </div>
    </div>
  );
}
