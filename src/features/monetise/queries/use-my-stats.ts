import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

interface MyStatsResponse {
  peakViewers: number;
  avgViews: number;
}

export const useMyStats = () => {
  return useQuery({
    queryKey: ["monetise", "my-stats"],
    queryFn: async () => {
      return api.get("me/stats").json<MyStatsResponse>();
    },
  });
};
