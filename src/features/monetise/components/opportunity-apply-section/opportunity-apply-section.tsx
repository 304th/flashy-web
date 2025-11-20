"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface OpportunityApplySectionProps {
  brandName: string;
  onApply: () => void;
  isApplying?: boolean;
}

export function OpportunityApplySection({
  brandName,
  onApply,
  isApplying = false,
}: OpportunityApplySectionProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-4 pt-4 border-t border-base-600">
      <div className="flex items-start gap-2">
        <Checkbox
          id="agreement"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
        />
        <label htmlFor="agreement" className="text-xs text-base-800 leading-relaxed cursor-pointer">
          By accepting this collaboration, you agree to complete and submit the specified deliverables by the deadline. {brandName} retains the right to approve or request revisions to content that does not align with the brief. Payment will be issued within 7 business days after approval.
        </label>
      </div>

      <Button
        onClick={onApply}
        disabled={!agreed || isApplying}
        pending={isApplying}
        className="min-w-[120px] sm:w-auto"
      >
        Apply
      </Button>
    </div>
  );
}
