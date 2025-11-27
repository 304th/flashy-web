"use client";

interface OpportunityDetailsProps {
  featureDescription: string;
  deliverables: string[];
  postingDeadline: string;
  compensation: string;
  payoutMethod: string;
  eligibility: string[];
}

export function OpportunityDetails({
  featureDescription,
  deliverables,
  postingDeadline,
  compensation,
  payoutMethod,
  eligibility,
}: OpportunityDetailsProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-base-800 leading-relaxed">
        {featureDescription}
      </p>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Deliverables</h3>
        <ul className="space-y-1.5">
          {deliverables.map((item, index) => (
            <li
              key={index}
              className="text-sm text-base-800 flex items-start gap-2"
            >
              <span className="text-base-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Posting Deadline</h3>
        <p className="text-sm text-base-800">{postingDeadline}</p>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Compensation</h3>
        <p className="text-sm text-base-800">{compensation}</p>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Payout Method</h3>
        <p className="text-sm text-base-800">{payoutMethod}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">Eligibility</h3>
        <ul className="space-y-1.5">
          {eligibility.map((item, index) => (
            <li
              key={index}
              className="text-sm text-brand-100 flex items-start gap-2"
            >
              <span className="text-base-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
