"use client";

interface BusinessOpportunityDetailsProps {
  brandName: string;
  compensation: string;
  compensationType: CompensationType;
  deadline: string;
  eligibility: OpportunityEligibility;
  deliverables?: string[];
  description?: string;
  showDeliverables?: boolean;
}

export function BusinessOpportunityDetails({
  brandName,
  compensation,
  compensationType,
  deadline,
  eligibility,
  deliverables = [],
  description,
  showDeliverables = false,
}: BusinessOpportunityDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const compensationDisplay =
    compensationType === "commission"
      ? `${compensation} Commission`
      : compensationType === "fixed"
        ? `$${compensation} Flat Fee`
        : compensation;

  return (
    <div className="space-y-6">
      {showDeliverables && description && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Description</h3>
          <p className="text-sm text-base-800 leading-relaxed">{description}</p>
        </div>
      )}

      {showDeliverables && deliverables.length > 0 && (
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
      )}

      {!showDeliverables && (
        <>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Brand Name</h3>
            <p className="text-sm text-base-800">{brandName}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Compensation</h3>
            <p className="text-sm text-base-800">{compensationDisplay}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Deadline</h3>
            <p className="text-sm text-base-800">{formatDate(deadline)}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Eligibility Requirements
            </h3>
            <ul className="space-y-1.5">
              {eligibility.minFollowers > 0 && (
                <li className="text-sm text-brand-100 flex items-start gap-2">
                  <span className="text-base-600">•</span>
                  <span>
                    Minimum {eligibility.minFollowers.toLocaleString()} followers
                  </span>
                </li>
              )}
              {eligibility.niches?.length > 0 && (
                <li className="text-sm text-brand-100 flex items-start gap-2">
                  <span className="text-base-600">•</span>
                  <span>Niches: {eligibility.niches.join(", ")}</span>
                </li>
              )}
              {eligibility.platforms?.length > 0 && (
                <li className="text-sm text-brand-100 flex items-start gap-2">
                  <span className="text-base-600">•</span>
                  <span>Platforms: {eligibility.platforms.join(", ")}</span>
                </li>
              )}
              {eligibility.countries?.length > 0 && (
                <li className="text-sm text-brand-100 flex items-start gap-2">
                  <span className="text-base-600">•</span>
                  <span>Countries: {eligibility.countries.join(", ")}</span>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
