"use client";

import Image from "next/image";
import { Check, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { SubmissionCreator } from "@/features/business/queries/use-submission-by-id";
import { UserProfile } from "@/components/ui/user-profile";
import Link from "next/link";
import { MessagesButton } from "@/features/auth/components/account-login/messages-button";
import { ChannelMessageButton } from "@/features/channels/components/channel-header/channel-message-button";

interface AgreementHeaderProps {
  creator: SubmissionCreator | null | undefined;
  status: CreatorOpportunityStatus;
  acceptedAt?: string;
  ccv?: number;
  onContact?: () => void;
}

const statusConfig: Record<
  CreatorOpportunityStatus,
  { label: string; color: string; icon: typeof Check }
> = {
  accepted: { label: "Active since", color: "text-brand-100", icon: Check },
  "pending-deliverables": {
    label: "Pending Deliverables",
    color: "text-yellow-500",
    icon: Clock,
  },
  submitted: { label: "Submitted on", color: "text-orange-500", icon: Check },
  "under-review": {
    label: "Under Review since",
    color: "text-blue-500",
    icon: Clock,
  },
  approved: { label: "Approved on", color: "text-green-500", icon: Check },
  rejected: { label: "Rejected on", color: "text-red-500", icon: Ban },
  expired: { label: "Expired on", color: "text-red-500", icon: Ban },
  completed: { label: "Completed on", color: "text-green-500", icon: Check },
};

export function AgreementHeader({
  creator,
  status,
  acceptedAt,
  ccv,
  onContact,
}: AgreementHeaderProps) {
  const config = statusConfig[status] || statusConfig.accepted;
  const StatusIcon = config.icon;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
    >
      <div className="flex items-center gap-4">
        {creator && (
          <UserProfile
            user={creator}
            withoutUsername
            avatarClassname="h-16 w-16"
          />
        )}

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              {creator?.username || "Unknown User"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className={`flex items-center gap-1 ${config.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span>
                {config.label}
                {acceptedAt && ` ${formatDate(acceptedAt)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        {creator && (
          <ChannelMessageButton
            channel={creator}
            title="Contact"
            variant="default"
            className="!w-full min-w-[242px]"
          />
        )}
        <div
          className="flex items-center gap-4 text-right w-full justify-between"
        >
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-white">
              {creator?.followersCount?.toLocaleString() || 0}
            </span>
            <span className="text-sm text-base-700 ml-1">Subscribers</span>
          </div>
          {ccv !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white">{ccv}</span>
              <span className="text-sm text-base-700 ml-1">CCV</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
