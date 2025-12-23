import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  sponsorSubmissionsCollection,
  SponsorSubmissionsCollectionParams,
} from "@/features/monetise/collections/sponsor-submissions";

const PAGE_LIMIT = 20;

interface UseSponsorSubmissionsParams {
  status?: CreatorOpportunityStatus | CreatorOpportunityStatus[];
}

export const useSponsorSubmissions = (
  params: UseSponsorSubmissionsParams = {},
) => {
  return usePartitionedQuery<
    CreatorOpportunity,
    SponsorSubmissionsCollectionParams
  >({
    collection: sponsorSubmissionsCollection,
    queryKey: ["monetise", "sponsor-submissions", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
      }) as any,
  });
};
