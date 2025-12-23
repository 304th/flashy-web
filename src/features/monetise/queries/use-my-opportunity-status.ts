import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useMyOpportunityStatus = (opportunityId: string | undefined) => {
  return useQuery({
    queryKey: ["monetise", "my-opportunity-status", opportunityId],
    queryFn: async () => {
      return api
        .get(`opportunities/${opportunityId}/my-status`)
        .json<MyOpportunityStatusResponse>();
    },
    enabled: Boolean(opportunityId),
  });
};
