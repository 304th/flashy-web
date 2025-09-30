import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export interface UpdateAvatarParams {
  userimage: string;
}

const updateBanner = createMutation<UpdateAvatarParams>({
  writeToSource: async (params) => {
    return api.put("user/userimage", {
      json: params,
    });
  },
});

export const useUpdateAvatar = () => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: updateBanner,
    optimisticUpdates: [
      async (params) => {
        return me.update((meUser) => {
          meUser.userimage = params.userimage;
        });
      },
    ],
  });
};
