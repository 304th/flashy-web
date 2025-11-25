import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { opportunitySchema } from "@/features/monetise/schemas/opportunity.schema";

export interface OpportunitiesCollectionParams {
  page?: number;
  limit?: number;
  type?: OpportunityType;
  category?: OpportunityCategory;
  niche?: string | string[];
  minPayout?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const opportunitiesCollection = createCollectionV2<
  Opportunity,
  OpportunitiesCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.type) searchParams.set("type", params.type);
    if (params.category) searchParams.set("category", params.category);
    if (params.niche) {
      if (Array.isArray(params.niche)) {
        params.niche.forEach((n) => searchParams.append("niche", n));
      } else {
        searchParams.set("niche", params.niche);
      }
    }
    if (params.minPayout) searchParams.set("minPayout", String(params.minPayout));
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const response = await api
      .get(`opportunities?${searchParams.toString()}`)
      .json<OpportunityListResponse>();

    return response.opportunities;
  },
  schema: opportunitySchema,
  name: "opportunities",
});
