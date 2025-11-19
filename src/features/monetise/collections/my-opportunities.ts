import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { creatorOpportunitySchema } from "@/features/monetise/schemas/opportunity.schema";

export interface MyOpportunitiesCollectionParams {
  page?: number;
  limit?: number;
  status?: CreatorOpportunityStatus | CreatorOpportunityStatus[];
}

export const myOpportunitiesCollection = createCollectionV2<
  CreatorOpportunity,
  MyOpportunitiesCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) {
      if (Array.isArray(params.status)) {
        params.status.forEach((s) => searchParams.append("status", s));
      } else {
        searchParams.set("status", params.status);
      }
    }

    const response = await api
      .get(`me/opportunities?${searchParams.toString()}`)
      .json<CreatorOpportunityListResponse>();

    return response.creatorOpportunities;
  },
  schema: creatorOpportunitySchema,
  name: "my-opportunities",
});
