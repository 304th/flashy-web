import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  opportunitySubmissionsCollection,
  OpportunitySubmissionsCollectionParams,
  OpportunitySubmissionWithCreator,
} from "@/features/business/collections/opportunity-submissions";

const PAGE_LIMIT = 20;

interface UseOpportunitySubmissionsParams {
  opportunityId: string;
  status?: CreatorOpportunityStatus;
}

export const useOpportunitySubmissions = (
  params: UseOpportunitySubmissionsParams,
) => {
  return usePartitionedQuery<
    OpportunitySubmissionWithCreator,
    OpportunitySubmissionsCollectionParams
  >({
    collection: opportunitySubmissionsCollection,
    queryKey: ["business", "opportunity-submissions", params.opportunityId, params.status],
    getParams: ({ pageParam }) =>
      ({
        opportunityId: params.opportunityId,
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
      }) as any,
  });
};
