import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export interface UpdateUserInfoParams {
  bio?: string;
  links?: {
    x?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

const updateUserInfo = createMutation<UpdateUserInfoParams>({
  writeToSource: async (params) => {
    return api.put("user", {
      json: {
        user: params,
      },
    });
  },
});

export const useUpdateUserInfo = () => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: updateUserInfo,
    optimisticUpdates: [
      async (params) => {
        return me.update((meUser) => {
          meUser.bio = params.bio;
          meUser.links = params.links;
        });
      },
    ],
  });
};
