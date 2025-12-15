import { api } from "@/services/api";
import { createCollection as createCollectionV2 } from "@/lib/query-toolkit-v2/collection";
import { creatorOpportunitySchema } from "@/features/monetise/schemas/opportunity.schema";

export interface OpportunitySubmissionWithCreator extends CreatorOpportunity {
  creator?: {
    fbId: string;
    username: string;
    userimage: string;
    email?: string;
  } | null;
}

export interface OpportunitySubmissionsResponse {
  submissions: OpportunitySubmissionWithCreator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OpportunitySubmissionsCollectionParams {
  opportunityId: string;
  page?: number;
  limit?: number;
  status?: CreatorOpportunityStatus;
}

export const opportunitySubmissionsCollection = createCollectionV2<
  OpportunitySubmissionWithCreator,
  OpportunitySubmissionsCollectionParams
>({
  async sourceFrom(params) {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.status) searchParams.set("status", params.status);

    const response = await api
      .get(
        `sponsor/opportunities/${params.opportunityId}/submissions?${searchParams.toString()}`,
      )
      .json<OpportunitySubmissionsResponse>();

    return response.submissions;
  },
  schema: creatorOpportunitySchema,
  name: "opportunity-submissions",
});
