"use client";

interface BusinessOpportunityTermsProps {
  terms: string;
}

export function BusinessOpportunityTerms({
  terms,
}: BusinessOpportunityTermsProps) {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <p className="text-sm text-base-800 leading-relaxed whitespace-pre-line">
        {terms || "No terms and conditions specified."}
      </p>
    </div>
  );
}
