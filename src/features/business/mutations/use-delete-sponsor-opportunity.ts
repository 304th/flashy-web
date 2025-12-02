import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { opportunitiesCollection } from "@/features/monetise/collections/opportunities";

export interface DeleteSponsorOpportunityParams {
  opportunityId: string;
}

interface DeleteSponsorOpportunityResponse {
  success: boolean;
  message: string;
}

const deleteSponsorOpportunityMutation = createMutation<
  DeleteSponsorOpportunityParams,
  DeleteSponsorOpportunityResponse
>({
  write: async (params) => {
    return api
      .delete(`sponsor/opportunities/${params.opportunityId}`)
      .json<DeleteSponsorOpportunityResponse>();
  },
});

export const useDeleteSponsorOpportunity = () => {
  return useOptimisticMutation<
    DeleteSponsorOpportunityParams,
    DeleteSponsorOpportunityResponse
  >({
    mutation: deleteSponsorOpportunityMutation,
    onOptimistic: (ch, params) => {
      return ch(opportunitiesCollection).delete(params.opportunityId);
    },
  });
};
