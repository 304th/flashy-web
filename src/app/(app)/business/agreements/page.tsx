"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GoBackButton } from "@/components/ui/go-back-button";
import { Button } from "@/components/ui/button";
import { useSubmissionById } from "@/features/business/queries/use-submission-by-id";
import { useTerminateAgreement } from "@/features/business/mutations/use-terminate-agreement";
import { useApproveSubmission } from "@/features/monetise";
import {
  AgreementTabs,
  type AgreementTabType,
} from "@/features/business/components/agreement-tabs/agreement-tabs";
import { AgreementHeader } from "@/features/business/components/agreement-header/agreement-header";
import { AgreementDeliverables } from "@/features/business/components/agreement-deliverables/agreement-deliverables";
import { BusinessOpportunityDetails } from "@/features/business/components/business-opportunity-details/business-opportunity-details";
import { BusinessOpportunityTerms } from "@/features/business/components/business-opportunity-terms/business-opportunity-terms";
import { useModals } from "@/hooks/use-modals";
import { toast } from "sonner";

export default function BusinessAgreementPage() {
  return (
    <Suspense fallback={<BusinessAgreementPageSkeleton />}>
      <BusinessAgreementPageContent />
    </Suspense>
  );
}

function BusinessAgreementPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-page">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-base-400 rounded animate-pulse" />
        <div className="h-4 bg-base-400 rounded w-20 animate-pulse" />
      </div>
      <div className="h-24 bg-base-400 rounded-lg animate-pulse" />
      <div className="h-10 bg-base-400 rounded animate-pulse w-1/2" />
      <div className="h-64 bg-base-400 rounded-lg animate-pulse" />
    </div>
  );
}

function BusinessAgreementPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modals = useModals();
  const submissionId = searchParams.get("id");
  const terminateAgreement = useTerminateAgreement();
  const approveSubmission = useApproveSubmission();

  const [activeTab, setActiveTab] = useState<AgreementTabType>("deliverables");

  const {
    data: submission,
    isLoading,
    refetch,
  } = useSubmissionById(submissionId || undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-page">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-base-400 rounded animate-pulse" />
          <div className="h-4 bg-base-400 rounded w-20 animate-pulse" />
        </div>
        <div className="h-24 bg-base-400 rounded-lg animate-pulse" />
        <div className="h-10 bg-base-400 rounded animate-pulse w-1/2" />
        <div className="h-64 bg-base-400 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[400px]">
        <p className="text-base-800">Agreement not found</p>
        <GoBackButton />
      </div>
    );
  }

  const opportunity = submission.opportunity;
  const isSubmitted = submission.status === "submitted";

  const handleContact = () => {
    if (submission.creator?.fbId) {
      router.push(`/messages?userId=${submission.creator.fbId}`);
    }
  };

  const handleTerminate = () => {
    modals.openModal("ConfirmModal", {
      title: "Terminate Agreement",
      description: `Are you sure you want to terminate the agreement with <strong>${submission.creator?.username || "this creator"}</strong>? This action cannot be undone.`,
      actionTitle: "Terminate",
      destructive: true,
      onConfirm: () => {
        if (!submissionId) return;
        terminateAgreement.mutate(submissionId, {
          onSuccess: (data) => {
            router.push(`/business/opportunities?id=${data.opportunityId}`);
          },
        });
      },
    });
  };

  const handleApprove = () => {
    if (!submissionId) return;
    approveSubmission.mutate(
      { creatorOpportunityId: submissionId },
      {
        onSuccess: () => {
          toast.success("Submission approved");
          refetch();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to approve submission");
        },
      },
    );
  };

  const handleReject = () => {
    if (!submissionId) return;
    modals.openModal("RejectSubmissionModal", {
      submissionId,
      creatorName: submission.creator?.username,
      onClose: () => modals.closeModal(),
      onSuccess: () => refetch(),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-page">
      <div>
        <GoBackButton />
      </div>

      <AgreementHeader
        creator={submission.creator}
        status={submission.status}
        acceptedAt={submission.acceptedAt}
        ccv={opportunity?.ccv}
        onContact={handleContact}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {isSubmitted && (
          <>
            <Button onClick={handleApprove} disabled={approveSubmission.isPending}>
              {approveSubmission.isPending ? "Approving..." : "Approve"}
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </>
        )}
        <Button
          variant="outline"
          onClick={handleTerminate}
          disabled={terminateAgreement.isPending}
        >
          {terminateAgreement.isPending ? "Terminating..." : "Terminate Agreement"}
        </Button>
      </div>

      <AgreementTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "deliverables" && (
        <AgreementDeliverables
          files={submission.submission?.files as string[] | undefined}
          links={submission.submission?.links}
          note={submission.submission?.note}
        />
      )}
      {activeTab === "description" && opportunity && (
        <BusinessOpportunityDetails
          brandName={opportunity.brandName}
          compensation={opportunity.compensation}
          compensationType={opportunity.compensationType}
          endDate={opportunity.endDate}
          eligibility={opportunity.eligibility}
          deliverables={opportunity.deliverables}
          description={opportunity.description}
          ccv={opportunity.ccv}
          avgViews={opportunity.avgViews}
          showDeliverables
        />
      )}
      {activeTab === "terms" && (
        <BusinessOpportunityTerms
          terms={
            opportunity?.termsAndConditions ||
            "Terms and conditions not available."
          }
        />
      )}
    </div>
  );
}
