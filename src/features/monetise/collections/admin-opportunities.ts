import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { opportunitySchema } from "@/features/monetise/schemas/opportunity.schema";

export interface AdminOpportunitiesCollectionParams {
  page?: number;
  limit?: number;
  status?: OpportunityStatus;
  createdBy?: string;
}

export const adminOpportunitiesCollection = createCollectionV2<
  Opportunity,
  AdminOpportunitiesCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);
    if (params.createdBy) searchParams.set("createdBy", params.createdBy);

    const response = await api
      .get(`admin/opportunities?${searchParams.toString()}`)
      .json<OpportunityListResponse>();

    return response.opportunities;
  },
  schema: opportunitySchema,
  name: "admin-opportunities",
});
