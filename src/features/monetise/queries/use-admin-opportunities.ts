import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  adminOpportunitiesCollection,
  AdminOpportunitiesCollectionParams,
} from "@/features/monetise/collections/admin-opportunities";

const PAGE_LIMIT = 50;

interface UseAdminOpportunitiesParams {
  status?: OpportunityStatus;
  createdBy?: string;
}

export const useAdminOpportunities = (params: UseAdminOpportunitiesParams = {}) => {
  return usePartitionedQuery<Opportunity, AdminOpportunitiesCollectionParams>({
    collection: adminOpportunitiesCollection,
    queryKey: ["monetise", "admin-opportunities", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
        createdBy: params.createdBy,
      }) as any,
  });
};
