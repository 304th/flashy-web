"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, XCircle, AlertCircle, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useOpportunityById,
  useAcceptOpportunity,
  useMyOpportunityStatus,
  useMyStats,
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
  return (
    <Suspense fallback={<OpportunityPageSkeleton />}>
      <OpportunityPageContent />
    </Suspense>
  );
}

function OpportunityPageSkeleton() {
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

function OpportunityPageContent() {
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
  const { data: myStats } = useMyStats();
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
    ? opportunity.compensationType === "commission"
      ? `${opportunity.compensation}% Commission`
      : opportunity.compensationType === "fixed"
        ? `$${opportunity.compensation} Flat Fee`
        : opportunity.compensation
    : "Negotiable";

  // Format end date
  const endDateDisplay = opportunity.endDate
    ? new Date(opportunity.endDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No end date";

  // Check if opportunity is active (between startDate and endDate)
  const getOpportunityStatus = () => {
    const now = new Date();
    const start = opportunity.startDate
      ? new Date(opportunity.startDate)
      : null;
    const end = opportunity.endDate ? new Date(opportunity.endDate) : null;

    if (start && now < start) {
      return {
        isActive: false,
        status: "upcoming" as const,
        message: `This opportunity starts on ${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      };
    }
    if (end && now > end) {
      return {
        isActive: false,
        status: "expired" as const,
        message: "This opportunity has ended",
      };
    }
    return {
      isActive: true,
      status: "active" as const,
      message: null,
    };
  };

  const opportunityStatus = getOpportunityStatus();

  // Check eligibility based on user stats
  const isStatsLoading = !myStats;
  const checkEligibility = () => {
    if (!opportunity) {
      return { isEligible: true, reasons: [] };
    }
    if (!myStats) {
      return { isEligible: true, reasons: [] };
    }

    const reasons: string[] = [];

    // Check CCV requirement
    if (opportunity.ccv && opportunity.ccv > 0) {
      if (myStats.peakViewers < opportunity.ccv) {
        reasons.push(
          `Minimum CCV required: ${opportunity.ccv} (Your CCV: ${myStats.peakViewers})`,
        );
      }
    }

    // Check average views requirement
    if (opportunity.avgViews && opportunity.avgViews > 0) {
      if (myStats.avgViews < opportunity.avgViews) {
        reasons.push(
          `Minimum Average Views required: ${opportunity.avgViews.toLocaleString()} (Your Average Views: ${myStats.avgViews.toLocaleString()})`,
        );
      }
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  };

  const eligibility = checkEligibility();

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
            isEligible={!isCreator && eligibility.isEligible}
            isCreator={!!isCreator}
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

        <div className="flex flex-col rounded-md border bg-base-200 p-4">
          {activeTab === "description" && (
            <OpportunityDetails
              featureDescription={opportunity.description}
              deliverables={opportunity.deliverables || []}
              postingDeadline={endDateDisplay}
              compensation={compensationDisplay}
              payoutMethod="Direct Bank Transfer (via Flashy Social's payment portal)"
              eligibility={[
                ...(opportunity.ccv && opportunity.ccv > 0
                  ? [{ text: `Minimum CCV: ${opportunity.ccv}`, failed: !isStatsLoading && myStats ? myStats.peakViewers < opportunity.ccv : false }]
                  : []),
                ...(opportunity.avgViews && opportunity.avgViews > 0
                  ? [{ text: `Minimum Average Views: ${opportunity.avgViews.toLocaleString()}`, failed: !isStatsLoading && myStats ? myStats.avgViews < opportunity.avgViews : false }]
                  : []),
                ...(opportunity.eligibility?.niches?.length
                  ? [{ text: `Niches: ${opportunity.eligibility.niches.join(", ")}` }]
                  : []),
                ...(opportunity.eligibility?.platforms?.length
                  ? [{ text: `Platforms: ${opportunity.eligibility.platforms.join(", ")}` }]
                  : []),
                ...(opportunity.eligibility?.countries?.length
                  ? [{ text: `Countries: ${opportunity.eligibility.countries.join(", ")}` }]
                  : []),
                { text: "Content must be 18+ friendly and in accordance with local legal guidelines" },
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
              files={
                myStatus.creatorOpportunity.submission?.files as
                  | string[]
                  | undefined
              }
              links={myStatus.creatorOpportunity.submission?.links}
              note={myStatus.creatorOpportunity.submission?.note}
            />
          )}
        </div>

        {isCreator ? (
          <div className="space-y-4 pt-4 border-t border-base-600">
            <div className="flex items-center gap-2 text-base-700">
              <Ban className="w-5 h-5" />
              <span className="text-sm font-medium">
                You cannot apply to your own opportunity
              </span>
            </div>
          </div>
        ) : (myStatus?.hasApplied ? (
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
          ) : !opportunityStatus.isActive ? (
            <div className="space-y-4 pt-4 border-t border-base-600">
              <div
                className={`flex items-center gap-2
                  ${opportunityStatus.status === "upcoming" ? "text-base-700" : "text-red-500"}`}
              >
                {opportunityStatus.status === "upcoming" ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Ban className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {opportunityStatus.message}
                </span>
              </div>
            </div>
          ) : isStatsLoading ? (
            <div className="space-y-4 pt-4 border-t border-base-600">
              <div className="flex items-center gap-2 text-base-700">
                <div className="w-5 h-5 bg-base-400 rounded animate-pulse" />
                <span className="text-sm font-medium">
                  Checking eligibility...
                </span>
              </div>
            </div>
          ) : !eligibility.isEligible ? (
            <div className="space-y-4 pt-4 border-t border-base-600">
              <div className="flex items-center gap-2 text-red-500">
                <Ban className="w-5 h-5" />
                <span className="text-sm font-medium">
                  You are not eligible for this opportunity
                </span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-2">
                {eligibility.reasons.map((reason, index) => (
                  <p key={index} className="text-sm text-red-400">
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-500">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">
                  You are eligible for this opportunity
                </span>
              </div>
              <OpportunityApplySection
                brandName={opportunity.brandName}
                onApply={handleApply}
                isApplying={acceptOpportunity.isPending}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
