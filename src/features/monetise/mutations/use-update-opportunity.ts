import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

export interface UpdateOpportunityMutationParams {
  opportunityId: string;
  data: UpdateOpportunityParams;
}

const updateOpportunityMutation = createMutation<
  UpdateOpportunityMutationParams,
  Opportunity
>({
  write: async (params) => {
    return api
      .put(`admin/opportunities/${params.opportunityId}`, {
        json: params.data,
      })
      .json<Opportunity>();
  },
});

export const useUpdateOpportunity = () => {
  return useOptimisticMutation<UpdateOpportunityMutationParams, Opportunity>({
    mutation: updateOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).update(
        params.opportunityId,
        (item) => {
          Object.assign(item, params.data);
          item.updatedAt = new Date().toISOString();
        }
      );
    },
  });
};
