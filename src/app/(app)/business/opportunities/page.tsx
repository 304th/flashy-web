"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Clock, Ban } from "lucide-react";
import { useOpportunityById } from "@/features/monetise";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import {
  BusinessOpportunityTabs,
  type BusinessTabType,
} from "@/features/business/components/business-opportunity-tabs/business-opportunity-tabs";
import { BusinessOpportunityDetails } from "@/features/business/components/business-opportunity-details/business-opportunity-details";
import { BusinessOpportunityMedia } from "@/features/business/components/business-opportunity-media/business-opportunity-media";
import { BusinessOpportunityTerms } from "@/features/business/components/business-opportunity-terms/business-opportunity-terms";
import { BusinessOpportunityAgreements } from "@/features/business/components/business-opportunity-agreements/business-opportunity-agreements";

export default function BusinessOpportunityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const opportunityId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<BusinessTabType>("account");

  const { data: opportunity, query } = useOpportunityById(
    opportunityId || undefined,
  );

  const isLoading = query.isLoading;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const endDateObj = new Date(endDate);
    const now = new Date();
    const days = Math.ceil(
      (endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days > 0 ? days : 0;
  };

  const getOpportunityStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        status: "upcoming" as const,
        message: `Starting on ${formatDate(startDate)}`,
        color: "text-base-700",
        icon: Clock,
      };
    } else if (now > end) {
      return {
        status: "expired" as const,
        message: `Ended on ${formatDate(endDate)}`,
        color: "text-red-500",
        icon: Ban,
      };
    } else {
      return {
        status: "active" as const,
        message: `Active since ${formatDate(startDate)}`,
        color: "text-green-500",
        icon: Check,
      };
    }
  };

  const daysRemaining = getDaysRemaining(opportunity.endDate);
  const opportunityStatus = getOpportunityStatus(
    opportunity.startDate,
    opportunity.endDate,
  );

  return (
    <div className="flex flex-col gap-6 max-w-page">
      <div>
        <GoBackButton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
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
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-3 grow-1">
            <div className={`flex items-center gap-2 text-sm ${opportunityStatus.color}`}>
              <opportunityStatus.icon className="w-4 h-4" />
              <span>{opportunityStatus.message}</span>
              {opportunityStatus.status === "active" && (
                <span className="text-base-600 ml-2">
                {daysRemaining} days remaining
              </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">{opportunity.title}</h1>
            <div className="flex items-center gap-2">
              <Tag className="!bg-base-300 !border-base-400 text-sm">
                {opportunity.brandName}
              </Tag>
              <Tag className="!bg-base-300 !border-base-400 text-sm">
                {opportunity.category}
              </Tag>
              <Tag className="!bg-base-300 !border-base-400 text-sm">
                {opportunity.type.charAt(0).toUpperCase() +
                  opportunity.type.slice(1)}
              </Tag>
            </div>
            <p className="text-white leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          <Button
            className="w-fit"
            onClick={() =>
              router.push(`/business/opportunities/edit?id=${opportunity._id}`)
            }
          >
            Edit Opportunity
          </Button>
        </div>
      </div>
      <BusinessOpportunityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "account" && (
        <BusinessOpportunityDetails
          brandName={opportunity.brandName}
          compensation={opportunity.compensation}
          compensationType={opportunity.compensationType}
          endDate={opportunity.endDate}
          eligibility={opportunity.eligibility}
          ccv={opportunity.ccv}
          avgViews={opportunity.avgViews}
        />
      )}
      {activeTab === "media" && (
        <BusinessOpportunityMedia
          mediaAssets={opportunity.mediaAssets}
          brandName={opportunity.brandName}
        />
      )}
      {activeTab === "description" && (
        <BusinessOpportunityDetails
          brandName={opportunity.brandName}
          compensation={opportunity.compensation}
          compensationType={opportunity.compensationType}
          endDate={opportunity.endDate}
          eligibility={opportunity.eligibility}
          deliverables={opportunity.deliverables}
          description={opportunity.description}
          showDeliverables
        />
      )}
      {activeTab === "terms" && (
        <BusinessOpportunityTerms terms={opportunity.termsAndConditions} />
      )}
      {activeTab === "agreements" && (
        <BusinessOpportunityAgreements opportunityId={opportunity._id} />
      )}
    </div>
  );
}
