import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { businessAccountSchema } from "@/features/business/schemas/business-account.schema";

const PAGE_LIMIT = 20;

interface BusinessAccountsWithUsersCollectionParams {
  page: number;
  limit: number;
  status?: BusinessAccountStatus;
  category?: BusinessAccountCategory;
  userId?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const businessAccountsWithUsersCollection = createCollection<
  BusinessAccountWithUser,
  BusinessAccountsWithUsersCollectionParams
>({
  name: "business-accounts-with-users",
  schema: businessAccountSchema,
  sourceFrom: async (params: BusinessAccountsWithUsersCollectionParams) => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", params.page.toString());
    searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);
    if (params.category) searchParams.append("category", params.category);
    if (params.userId) searchParams.append("userId", params.userId);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const response = await api
      .get(`admin/business-accounts?${searchParams.toString()}`)
      .json<BusinessAccountListResponse>();

    return response.businessAccounts;
  },
});

interface UseBusinessAccountsWithUsersParams {
  status?: BusinessAccountStatus;
  category?: BusinessAccountCategory;
  userId?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export const useBusinessAccountsWithUsers = (
  params: UseBusinessAccountsWithUsersParams = {},
) => {
  return usePartitionedQuery<
    BusinessAccountWithUser,
    BusinessAccountsWithUsersCollectionParams
  >({
    collection: businessAccountsWithUsersCollection,
    queryKey: ["business", "accounts", "admin", params],
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
