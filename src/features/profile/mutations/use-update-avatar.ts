import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UpdateAvatarParams {
  userimage: string;
}

const updateBanner = createMutation<UpdateAvatarParams>({
  write: async (params) => {
    return api.put("user/userimage", {
      json: params,
    });
  },
});

export const useUpdateAvatar = () => {
  return useOptimisticMutation({
    mutation: updateBanner,
    onOptimistic: (ch, params) => {
      return ch(meEntity).update((me) => {
        me.userimage = params.userimage;
      });
    },
  });
};
