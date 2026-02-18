"use client";

import { Check, Star, Upload, XCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelMessageButton } from "@/features/channels/components/channel-header/channel-message-button";
import { useMemo } from "react";
import { Tag } from "@/components/ui/tag";
import { useModals } from "@/hooks/use-modals";

interface OpportunityHeaderProps {
  opportunity: Opportunity;
  title: string;
  brandName: string;
  category: string;
  type: string;
  description: string;
  isEligible?: boolean;
  isCreator?: boolean;
  isFavourited?: boolean;
  hasApplied?: boolean;
  status?: string;
  onToggleFavourite?: () => void;
  onSubmitSuccess?: () => void;
}

export function OpportunityHeader({
  opportunity,
  title,
  brandName,
  category,
  type,
  description,
  isEligible = false,
  isCreator = false,
  isFavourited = false,
  hasApplied = false,
  status,
  onToggleFavourite,
  onSubmitSuccess,
}: OpportunityHeaderProps) {
  const modals = useModals();

  const businessCreator = useMemo(() => {
    return {
      username: "",
      userimage: "",
      fbId: opportunity.createdBy,
    };
  }, [opportunity]);

  const canSubmitDeliverables =
    hasApplied && status && ["accepted", "rejected"].includes(status);

  const handleSubmitDeliverables = () => {
    modals.openModal("SubmitDeliverablesModal", {
      opportunityId: opportunity._id,
      onClose: () => modals.closeModal(),
      onSuccess: onSubmitSuccess,
    });
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "rejected":
        return (
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Your submission was rejected</span>
          </div>
        );
      case "approved":
        return (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-4 h-4" />
            <span className="text-sm">Your submission has been approved!</span>
          </div>
        );
      case "submitted":
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Deliverables submitted - Awaiting review
            </span>
          </div>
        );
      case "accepted":
        return (
          <div className="flex items-center gap-2 text-brand-100">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Accepted - Pending deliverables submission
            </span>
          </div>
        );
    }

    if (isCreator) {
      return (
        <div className="flex items-center gap-2 text-base-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            You cannot apply to your own opportunity
          </span>
        </div>
      );
    }

    if (!isEligible) {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <XCircle className="w-4 h-4" />
          <span className="text-sm">
            You are not eligible for this opportunity
          </span>
        </div>
      );
    }

    if (!hasApplied) {
      return (
        <div className="flex items-center gap-2 text-brand-100">
          <Check className="w-4 h-4" />
          <span className="text-sm">You are eligible for this opportunity</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col justify-between grow-1 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {getStatusDisplay()}
          <h1 className="text-3xl font-bold text-white">{title}</h1>
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
      </div>
      <div className="flex items-center gap-2">
        {hasApplied && (
          <ChannelMessageButton
            title="Contact"
            variant="default"
            channel={businessCreator}
          />
        )}
        {canSubmitDeliverables && (
          <Button onClick={handleSubmitDeliverables} className="gap-2">
            <Upload className="w-4 h-4" />
            Submit Deliverables
          </Button>
        )}
        <Button variant="outline" onClick={onToggleFavourite} className="gap-2">
          <Star
            className={`w-4 h-4 ${isFavourited ? "text-yellow-400" : ""}`}
            fill={isFavourited ? "currentColor" : "none"}
          />
          {isFavourited ? "Remove From Favourites" : "Add To Favourites"}
        </Button>
      </div>
    </div>
  );
}
