import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { opportunitySchema } from "@/features/monetise/schemas/opportunity.schema";

export interface SponsorOpportunitiesCollectionParams {
  page?: number;
  limit?: number;
  status?: OpportunityStatus;
}

export const sponsorOpportunitiesCollection = createCollectionV2<
  Opportunity,
  SponsorOpportunitiesCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);

    const response = await api
      .get(`sponsor/opportunities?${searchParams.toString()}`)
      .json<OpportunityListResponse>();

    return response.opportunities;
  },
  schema: opportunitySchema,
  name: "sponsor-opportunities",
});