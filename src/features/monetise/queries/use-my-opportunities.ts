import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  myOpportunitiesCollection,
  MyOpportunitiesCollectionParams,
  TimeRange,
} from "@/features/monetise/collections/my-opportunities";

const PAGE_LIMIT = 20;

interface UseMyOpportunitiesParams {
  status?: CreatorOpportunityStatus | CreatorOpportunityStatus[];
  timeRange?: TimeRange;
}

export const useMyOpportunities = (params: UseMyOpportunitiesParams = {}) => {
  return usePartitionedQuery<
    CreatorOpportunity,
    MyOpportunitiesCollectionParams
  >({
    collection: myOpportunitiesCollection,
    queryKey: ["monetise", "my-opportunities", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
        timeRange: params.timeRange,
      }) as any,
  });
};
