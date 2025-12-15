"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import {
  useOpportunityById,
  useAcceptOpportunity,
  useMyOpportunityStatus,
  OpportunityHeader,
  OpportunityTabs,
  OpportunityDetails,
  OpportunityTerms,
  OpportunityApplySection,
  type TabType,
} from "@/features/monetise";
import { useWishlistStore } from "@/stores";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";

export default function OpportunityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const opportunityId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<TabType>("description");
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const { data: opportunity, query } = useOpportunityById(
    opportunityId || undefined,
  );
  const { data: myStatus, isLoading: isStatusLoading } = useMyOpportunityStatus(
    opportunityId || undefined,
  );
  const acceptOpportunity = useAcceptOpportunity();

  const isLoading = query.isLoading;

  const handleApply = () => {
    if (!opportunityId) return;
    acceptOpportunity.mutate(
      { opportunityId },
      {
        onSuccess: () => {
          router.push("/monetise/creator-dashboard");
        },
      },
    );
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
      <div
        className="flex flex-col items-center justify-center gap-4 p-6
          min-h-[400px]"
      >
        <p className="text-base-800">Opportunity not found</p>
        <GoBackButton />
      </div>
    );
  }

  // Format compensation display
  const compensationDisplay = opportunity.compensation
    ? `$${opportunity.compensation} ${opportunity.compensationType === "fixed" ? "Flat Fee" : opportunity.compensationType}`
    : "Negotiable";

  // Format end date
  const endDateDisplay = opportunity.endDate
    ? new Date(opportunity.endDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No end date";

  return (
    <div className="flex flex-col gap-4 max-w-page">
      <div className="flex items-center gap-4">
        <GoBackButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4">
        <div
          className="relative aspect-video rounded-lg overflow-hidden
            bg-base-400"
        >
          {opportunity.brandLogo ? (
            <Image
              src={opportunity.brandLogo}
              alt={opportunity.title}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="flex items-center justify-center h-full text-base-600"
            >
              No image available
            </div>
          )}
        </div>

        <div className="space-y-6">
          <OpportunityHeader
            title={opportunity.title}
            brandName={opportunity.brandName}
            category={opportunity.category}
            type={
              opportunity.type.charAt(0).toUpperCase() +
              opportunity.type.slice(1)
            }
            description={opportunity.description}
            isEligible={true}
            isFavourited={isWishlisted(opportunity._id)}
            onToggleFavourite={() => toggleWishlist(opportunity._id)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <OpportunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "description" ? (
          <OpportunityDetails
            featureDescription={`Feature our premium ${opportunity.title} on your YouTube channel. Focus on what sets them apart: ${opportunity.description}`}
            deliverables={opportunity.deliverables || []}
            postingDeadline={endDateDisplay}
            compensation={compensationDisplay}
            payoutMethod="Direct Bank Transfer (via Flashy Social's payment portal)"
            eligibility={[
              ...(opportunity.eligibility?.niches?.length
                ? [`Niches: ${opportunity.eligibility.niches.join(", ")}`]
                : []),
              ...(opportunity.eligibility?.platforms?.length
                ? [`Platforms: ${opportunity.eligibility.platforms.join(", ")}`]
                : []),
              ...(opportunity.eligibility?.countries?.length
                ? [`Countries: ${opportunity.eligibility.countries.join(", ")}`]
                : []),
              "Content must be 18+ friendly and in accordance with local legal guidelines",
            ]}
          />
        ) : (
          <OpportunityTerms
            terms={
              opportunity.termsAndConditions ||
              "Terms and conditions will be provided upon acceptance of the opportunity."
            }
          />
        )}

        {myStatus?.hasApplied ? (
          <div className="space-y-4 pt-4 border-t border-base-600">
            <div className="flex items-center gap-2 text-brand-100">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">
                You have already applied to this opportunity
              </span>
            </div>
            <p className="text-xs text-base-800">
              Status:{" "}
              <span className="text-white capitalize">
                {myStatus.status?.replace(/-/g, " ")}
              </span>
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/monetise/creator-dashboard")}
            >
              View My Opportunities
            </Button>
          </div>
        ) : (
          <OpportunityApplySection
            brandName={opportunity.brandName}
            onApply={handleApply}
            isApplying={acceptOpportunity.isPending}
          />
        )}
      </div>
    </div>
  );
}
