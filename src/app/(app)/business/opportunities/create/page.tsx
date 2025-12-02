"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateOpportunityForm } from "@/features/business/components/create-opportunity-form/create-opportunity-form";

export default function CreateOpportunityPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

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
        <h1 className="text-3xl font-bold text-white">Create Opportunity</h1>
      </div>
      <div className="flex-1">
        <CreateOpportunityForm onCancel={handleCancel} />
      </div>
    </div>
  );
}
