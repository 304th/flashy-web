import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export interface UpdateBannerParams {
  banner: string;
}

const updateBanner = createMutation<UpdateBannerParams>({
  writeToSource: async (params) => {
    return api.put("user/banner", {
      json: params,
    });
  },
});

export const useUpdateBanner = () => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: updateBanner,
    optimisticUpdates: [
      async (params) => {
        return me.update((meUser) => {
          meUser.banner = params.banner;
        });
      },
    ],
  });
};
