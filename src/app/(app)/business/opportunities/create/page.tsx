"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateOpportunityForm } from "@/features/business/components/create-opportunity-form/create-opportunity-form";

export default function CreateOpportunityPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col max-w-page py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="!p-2 aspect-square"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Create Agreement</h1>
        </div>
        <CreateOpportunityForm onCancel={handleCancel} />
      </div>
    </div>
  );
}
