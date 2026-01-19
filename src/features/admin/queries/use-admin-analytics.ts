import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export interface AdminAnalytics {
  totalUsers: number;
  totalSocialPosts: number;
  totalVideos: number;
}

export const useAdminAnalytics = () => {
  return getQuery(
    ["admin", "analytics"],
    async () => {
      return api.get("admin/analytics").json<AdminAnalytics>();
    },
    true,
    {
      staleTime: 60 * 1000,
    },
  );
};
