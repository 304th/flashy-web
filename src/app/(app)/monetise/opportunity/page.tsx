"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { BusinessOpportunityMedia } from "@/features/business/components/business-opportunity-media/business-opportunity-media";
import { AgreementDeliverables } from "@/features/business/components/agreement-deliverables/agreement-deliverables";
import { useMe } from "@/features/auth/queries/use-me";
import { useWishlistStore } from "@/stores";
import { GoBackButton } from "@/components/ui/go-back-button";

export default function OpportunityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const opportunityId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<TabType>("description");
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const { data: opportunity, query } = useOpportunityById(
    opportunityId || undefined,
  );
  const {
    data: myStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useMyOpportunityStatus(opportunityId || undefined);
  const { data: me } = useMe();
  const acceptOpportunity = useAcceptOpportunity();

  const isLoading = query.isLoading;
  const isCreator = me?.fbId && opportunity?.createdBy === me.fbId;

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
            opportunity={opportunity}
            title={opportunity.title}
            brandName={opportunity.brandName}
            category={opportunity.category}
            type={
              opportunity.type.charAt(0).toUpperCase() +
              opportunity.type.slice(1)
            }
            description={opportunity.description}
            isEligible={!isCreator}
            isFavourited={isWishlisted(opportunity._id)}
            hasApplied={myStatus?.hasApplied}
            status={myStatus?.status ?? undefined}
            onToggleFavourite={() => toggleWishlist(opportunity._id)}
            onSubmitSuccess={() => refetchStatus()}
          />
        </div>
      </div>

      <div className="space-y-6">
        <OpportunityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showDeliverables={myStatus?.hasApplied}
        />

        {activeTab === "description" && (
          <OpportunityDetails
            featureDescription={opportunity.description}
            deliverables={opportunity.deliverables || []}
            postingDeadline={endDateDisplay}
            compensation={compensationDisplay}
            payoutMethod="Direct Bank Transfer (via Flashy Social's payment portal)"
            eligibility={[
              ...(opportunity.ccv && opportunity.ccv > 0
                ? [`Minimum CCV: ${opportunity.ccv}`]
                : []),
              ...(opportunity.avgViews && opportunity.avgViews > 0
                ? [`Minimum Average Views: ${opportunity.avgViews.toLocaleString()}`]
                : []),
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
        )}
        {activeTab === "media" && (
          <BusinessOpportunityMedia
            mediaAssets={opportunity.mediaAssets}
            brandName={opportunity.brandName}
          />
        )}
        {activeTab === "terms" && (
          <OpportunityTerms
            terms={
              opportunity.termsAndConditions ||
              "Terms and conditions will be provided upon acceptance of the opportunity."
            }
          />
        )}
        {activeTab === "deliverables" && myStatus?.creatorOpportunity && (
          <AgreementDeliverables
            files={myStatus.creatorOpportunity.submission?.files as string[] | undefined}
            links={myStatus.creatorOpportunity.submission?.links}
            note={myStatus.creatorOpportunity.submission?.note}
          />
        )}

        {!isCreator && (
          myStatus?.hasApplied ? (
            <div className="space-y-4 pt-4 border-t border-base-600">
              {myStatus.status === "rejected" ? (
                <>
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Your submission was rejected
                    </span>
                  </div>
                  {myStatus.creatorOpportunity?.feedback && (
                    <div className="bg-base-300 rounded-lg p-4">
                      <p className="text-xs text-base-700 mb-1">
                        Reason for rejection:
                      </p>
                      <p className="text-sm text-white">
                        {myStatus.creatorOpportunity.feedback}
                      </p>
                    </div>
                  )}
                </>
              ) : myStatus.status === "approved" ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Your submission has been approved!
                  </span>
                </div>
              ) : myStatus.status === "accepted" ? (
                <div className="flex items-center gap-2 text-brand-100">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Accepted - Pending deliverables submission
                  </span>
                </div>
              ) : myStatus.status === "submitted" ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Deliverables submitted - Awaiting review
                  </span>
                </div>
              ) : (
                <>
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
                </>
              )}
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
          )
        )}
      </div>
    </div>
  );
}
