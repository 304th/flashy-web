import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  businessAccountsCollection,
  BusinessAccountsCollectionParams,
} from "@/features/business/collections/business-accounts";

const PAGE_LIMIT = 20;

interface UseBusinessAccountsParams {
  status?: BusinessAccountStatus;
  category?: BusinessAccountCategory;
  userId?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const useBusinessAccounts = (params: UseBusinessAccountsParams = {}) => {
  return usePartitionedQuery<
    BusinessAccountWithUser,
    BusinessAccountsCollectionParams
  >({
    collection: businessAccountsCollection,
    queryKey: ["business", "accounts", params],
    getParams: ({ pageParam }) =>
      ({
        page: pageParam,
        limit: PAGE_LIMIT,
        status: params.status,
        category: params.category,
        userId: params.userId,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }) as any,
  });
};
