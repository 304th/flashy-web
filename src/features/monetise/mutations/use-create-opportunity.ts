import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

const createOpportunityMutation = createMutation<
  CreateOpportunityParams,
  Opportunity
>({
  write: async (params) => {
    return api
      .post("admin/opportunities", {
        json: params,
      })
      .json<Opportunity>();
  },
});

export const useCreateOpportunity = () => {
  return useOptimisticMutation<CreateOpportunityParams, Opportunity>({
    mutation: createOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).prepend(
        {
          ...params,
          status: params.status || "active",
          compensationType: params.compensationType || "fixed",
          eligibility: {
            minFollowers: params.eligibility?.minFollowers || 0,
            niches: params.eligibility?.niches || [],
            platforms: params.eligibility?.platforms || [],
            countries: params.eligibility?.countries || [],
          },
          maxParticipants: params.maxParticipants || 0,
          currentParticipants: 0,
        },
        {
          sync: true,
        }
      );
    },
  });
};
