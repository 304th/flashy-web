import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useOpportunitiesByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ["monetise", "opportunities", "batch", ids],
    queryFn: async () => {
      if (!ids || ids.length === 0) {
        return [];
      }
      return api
        .post("opportunities/batch", { json: { ids } })
        .json<Opportunity[]>();
    },
    enabled: ids.length > 0,
  });
};
