import { api } from "@/services/api";
import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";

export const opportunityEntity = createEntity<Opportunity, { id: string }>({
  sourceFrom: async (params) => {
    return api.get(`opportunities/${params?.id!}`).json<Opportunity>();
  },
  name: "opportunity",
});

export const useOpportunityById = (id: string | undefined) => {
  return useLiveEntity<Opportunity, { id: string }>({
    entity: opportunityEntity,
    queryKey: ["monetise", "opportunity", id],
    getParams: () => ({ id: id! }),
    options: {
      enabled: Boolean(id),
    },
  });
};
