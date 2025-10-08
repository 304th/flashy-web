import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UpdateBannerParams {
  banner: string;
}

const updateBanner = createMutation<UpdateBannerParams>({
  write: async (params) => {
    return api.put("user/banner", {
      json: params,
    });
  },
});

export const useUpdateBanner = () => {
  return useOptimisticMutation({
    mutation: updateBanner,
    onOptimistic: (ch, params) => {
      return ch(meEntity).update((me) => {
        me.banner = params.banner;
      });
    },
  });
};
