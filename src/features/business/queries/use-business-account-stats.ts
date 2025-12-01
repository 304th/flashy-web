import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useBusinessAccountStats = () => {
  return useQuery<BusinessAccountStatsResponse>({
    queryKey: ["business", "stats"],
    queryFn: async () => {
      return api
        .get("admin/business-accounts/stats")
        .json<BusinessAccountStatsResponse>();
    },
  });
};
