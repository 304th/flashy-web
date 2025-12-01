import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { businessAccountSchema } from "@/features/business/schemas/business-account.schema";

export interface BusinessAccountsCollectionParams {
  page?: number;
  limit?: number;
  status?: BusinessAccountStatus;
  category?: BusinessAccountCategory;
  userId?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const businessAccountsCollection = createCollectionV2<
  BusinessAccount,
  BusinessAccountsCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.category) searchParams.set("category", params.category);
    if (params.userId) searchParams.set("userId", params.userId);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await api
      .get(`admin/business-accounts?${searchParams.toString()}`)
      .json<BusinessAccountListResponse>();

    return response.businessAccounts;
  },
  schema: businessAccountSchema,
  name: "business-accounts",
});
