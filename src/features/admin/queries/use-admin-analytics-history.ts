import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface AnalyticsSnapshot {
  date: string;
  totalUsers: number;
  totalSocialPosts: number;
  totalVideos: number;
}

export const useAdminAnalyticsHistory = (days: number = 30) => {
  return getQuery(
    ["admin", "analytics", "history", days],
    async () => {
      return api
        .get("admin/analytics/history", { searchParams: { days } })
        .json<AnalyticsSnapshot[]>();
    },
    true,
    {
      staleTime: 5 * 60 * 1000,
    },
  );
};
