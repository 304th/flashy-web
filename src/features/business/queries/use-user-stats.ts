import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

interface UserStatsResponse {
  peakViewers: number;
  avgViews: number;
}

export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["business", "user-stats", userId],
    queryFn: async () => {
      return api.get(`users/${userId}/stats`).json<UserStatsResponse>();
    },
    enabled: !!userId,
  });
};
