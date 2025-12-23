import { getQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";

export const useHomeBanners = () => {
  return getQuery(
    ["admin", "home-banners"],
    async () => {
      return api.get("home-banners").json<HomeBanner[]>();
    },
    true,
    {
      staleTime: 30 * 1000,
    },
  );
};
