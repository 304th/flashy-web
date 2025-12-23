import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

export interface DeleteOpportunityParams {
  opportunityId: string;
}

interface DeleteOpportunityResponse {
  success: boolean;
  message: string;
}

const deleteOpportunityMutation = createMutation<
  DeleteOpportunityParams,
  DeleteOpportunityResponse
>({
  write: async (params) => {
    return api
      .delete(`admin/opportunities/${params.opportunityId}`)
      .json<DeleteOpportunityResponse>();
  },
});

export const useDeleteOpportunity = () => {
  return useOptimisticMutation<
    DeleteOpportunityParams,
    DeleteOpportunityResponse
  >({
    mutation: deleteOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).delete(params.opportunityId);
    },
  });
};
