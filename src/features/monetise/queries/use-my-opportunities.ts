import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  myOpportunitiesCollection,
  MyOpportunitiesCollectionParams,
} from "@/features/monetise/collections/my-opportunities";

const PAGE_LIMIT = 20;

interface UseMyOpportunitiesParams {
  status?: CreatorOpportunityStatus | CreatorOpportunityStatus[];
}

export const useMyOpportunities = (params: UseMyOpportunitiesParams = {}) => {
  return usePartitionedQuery<CreatorOpportunity, MyOpportunitiesCollectionParams>({
    collection: myOpportunitiesCollection,
    queryKey: ["monetise", "my-opportunities", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
      }) as any,
  });
};
