import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateHomeBannerMutationParams extends UpdateHomeBannerParams {
  id: string;
}

const updateHomeBannerMutation = createMutation<
  UpdateHomeBannerMutationParams,
  HomeBanner
>({
  write: async ({ id, ...params }) => {
    return api.put(`home-banners/${id}`, { json: params }).json<HomeBanner>();
  },
});

export const useUpdateHomeBanner = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation<UpdateHomeBannerMutationParams, HomeBanner>({
    mutation: updateHomeBannerMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "home-banners"],
      });
    },
  });
};
