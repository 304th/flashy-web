"use client";

interface OpportunityTermsProps {
  terms: string;
}

export function OpportunityTerms({ terms }: OpportunityTermsProps) {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <p className="text-sm text-base-800 leading-relaxed whitespace-pre-line">
        {terms}
      </p>
    </div>
  );
}
