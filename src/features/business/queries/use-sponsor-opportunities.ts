import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  sponsorOpportunitiesCollection,
  SponsorOpportunitiesCollectionParams,
} from "@/features/business/collections/sponsor-opportunities";

const PAGE_LIMIT = 20;

interface UseSponsorOpportunitiesParams {
  status?: OpportunityStatus;
}

export const useSponsorOpportunities = (
  params: UseSponsorOpportunitiesParams = {},
) => {
  return usePartitionedQuery<Opportunity, SponsorOpportunitiesCollectionParams>(
    {
      collection: sponsorOpportunitiesCollection,
      queryKey: ["me", "business", "sponsor-opportunities", params],
      getParams: ({ pageParam }) =>
        ({
          page: pageParam,
          limit: PAGE_LIMIT,
          status: params.status,
        }) as any,
    },
  );
};
