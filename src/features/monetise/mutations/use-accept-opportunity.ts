import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { myOpportunitiesCollection } from "@/features/monetise/collections/my-opportunities";

export interface AcceptOpportunityParams {
  opportunityId: string;
}

const acceptOpportunityMutation = createMutation<
  AcceptOpportunityParams,
  AcceptOpportunityResponse
>({
  write: async (params) => {
    return api
      .post(`opportunities/${params.opportunityId}/accept`)
      .json<AcceptOpportunityResponse>();
  },
});

export const useAcceptOpportunity = () => {
  return useOptimisticMutation<AcceptOpportunityParams, AcceptOpportunityResponse>({
    mutation: acceptOpportunityMutation,
    onOptimistic: (ch, params) => {
      // Add optimistic entry to my-opportunities
      return ch(myOpportunitiesCollection).append({
        opportunityId: params.opportunityId,
        status: "accepted",
        appliedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
      } as any);
    },
  });
};
