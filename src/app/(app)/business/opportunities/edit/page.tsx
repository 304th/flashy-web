"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditOpportunityForm } from "@/features/business/components/edit-opportunity-form/edit-opportunity-form";
import { useOpportunityById } from "@/features/monetise";

export default function EditOpportunityPage() {
  return (
    <Suspense fallback={<EditOpportunityPageSkeleton />}>
      <EditOpportunityPageContent />
    </Suspense>
  );
}

function EditOpportunityPageSkeleton() {
  return (
    <div className="flex flex-col gap-8 max-w-page">
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-10 h-10 bg-base-400 rounded animate-pulse" />
        <div className="h-8 bg-base-400 rounded w-48 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-base-400 rounded animate-pulse" />
        <div className="h-12 bg-base-400 rounded animate-pulse" />
        <div className="h-32 bg-base-400 rounded animate-pulse" />
      </div>
    </div>
  );
}

function EditOpportunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");

  const { data: opportunity, query } = useOpportunityById(
    opportunityId || undefined,
  );

  const handleCancel = () => {
    router.back();
  };

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-page">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-base-400 rounded animate-pulse" />
          <div className="h-8 bg-base-400 rounded w-48 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-base-400 rounded animate-pulse" />
          <div className="h-12 bg-base-400 rounded animate-pulse" />
          <div className="h-32 bg-base-400 rounded animate-pulse" />
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
        <Button variant="secondary" onClick={handleCancel}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-page">
      <div className="flex items-center gap-4 shrink-0">
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="!p-2 aspect-square"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Edit Opportunity</h1>
      </div>
      <div className="flex-1">
        <EditOpportunityForm
          opportunity={opportunity}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
