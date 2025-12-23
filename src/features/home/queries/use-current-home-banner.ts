import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const useCurrentHomeBanner = () => {
  return getQuery(
    ["home-banner", "current"],
    async () => {
      return api.get("home-banners/current").json<HomeBanner | null>();
    },
    true,
    {
      staleTime: 60 * 1000, // 1 minute
    },
  );
};
