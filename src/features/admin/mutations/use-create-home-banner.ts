import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useQueryClient } from "@tanstack/react-query";

const createHomeBannerMutation = createMutation<
  CreateHomeBannerParams,
  HomeBanner
>({
  write: async (params) => {
    return api.post("home-banners", { json: params }).json<HomeBanner>();
  },
});

export const useCreateHomeBanner = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<CreateHomeBannerParams, HomeBanner>({
    mutation: createHomeBannerMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "home-banners"] });
    },
  });
};
