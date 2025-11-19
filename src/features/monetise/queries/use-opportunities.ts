import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  opportunitiesCollection,
  OpportunitiesCollectionParams,
} from "@/features/monetise/collections/opportunities";

const PAGE_LIMIT = 20;

interface UseOpportunitiesParams {
  type?: OpportunityType;
  niche?: string | string[];
  minPayout?: number;
  search?: string;
  sortBy?: "createdAt" | "deadline" | "compensation";
  sortOrder?: "asc" | "desc";
}

export const useOpportunities = (params: UseOpportunitiesParams = {}) => {
  return usePartitionedQuery<Opportunity, OpportunitiesCollectionParams>({
    collection: opportunitiesCollection,
    queryKey: ["monetise", "opportunities", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        type: params.type,
        niche: params.niche,
        minPayout: params.minPayout,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }) as any,
  });
};
