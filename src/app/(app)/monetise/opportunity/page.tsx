"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useOpportunityById,
  useAcceptOpportunity,
  OpportunityHeader,
  OpportunityTabs,
  OpportunityDetails,
  OpportunityTerms,
  OpportunityApplySection,
  type TabType,
} from "@/features/monetise";
import { useWishlistStore } from "@/stores";

export default function OpportunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<TabType>("description");
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const { data: opportunity, query } = useOpportunityById(opportunityId || undefined);
  const acceptOpportunity = useAcceptOpportunity();

  const isLoading = query.isLoading;

  const handleApply = () => {
    if (!opportunityId) return;
    acceptOpportunity.mutate({ opportunityId });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-page">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-base-400 rounded animate-pulse" />
          <div className="h-4 bg-base-400 rounded w-20 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video bg-base-400 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-base-400 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-base-400 rounded w-1/2 animate-pulse" />
            <div className="h-20 bg-base-400 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[400px]">
        <p className="text-base-800">Opportunity not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Format compensation display
  const compensationDisplay = opportunity.compensation
    ? `$${opportunity.compensation} ${opportunity.compensationType === "fixed" ? "Flat Fee" : opportunity.compensationType}`
    : "Negotiable";

  // Format deadline
  const deadlineDisplay = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  return (
    <div className="flex flex-col gap-6 max-w-page">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Go Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-base-400">
          {opportunity.brandLogo ? (
            <Image
              src={opportunity.brandLogo}
              alt={opportunity.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-base-600">
              No image available
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          <OpportunityHeader
            title={opportunity.title}
            brandName={opportunity.brandName}
            category={opportunity.eligibility?.niches?.[0] || "General"}
            type={opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
            description={opportunity.description}
            isEligible={true}
            isFavourited={isWishlisted(opportunity._id)}
            onToggleFavourite={() => toggleWishlist(opportunity._id)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="space-y-6">
        <OpportunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "description" ? (
          <OpportunityDetails
            featureDescription={`Feature our premium ${opportunity.title} on your YouTube channel. Focus on what sets them apart: ${opportunity.description}`}
            deliverables={opportunity.deliverables || []}
            postingDeadline={deadlineDisplay}
            compensation={compensationDisplay}
            payoutMethod="Direct Bank Transfer (via Flashy Social's payment portal)"
            eligibility={[
              `YouTube channel with ${opportunity.eligibility?.minFollowers?.toLocaleString() || "1,000"}+ subscribers`,
              "Instagram account with 1,000+ followers",
              "Content must be 18+ friendly and in accordance with local legal guidelines",
            ]}
          />
        ) : (
          <OpportunityTerms
            terms={opportunity.termsAndConditions || "Terms and conditions will be provided upon acceptance of the opportunity."}
          />
        )}

        <OpportunityApplySection
          brandName={opportunity.brandName}
          onApply={handleApply}
          isApplying={acceptOpportunity.isPending}
        />
      </div>
    </div>
  );
}
