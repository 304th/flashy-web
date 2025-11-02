import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UpdateUserInfoParams {
  bio?: string;
  receivesMessagesFromAnyone?: boolean;
  links?: {
    x?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

const updateUserInfo = createMutation<UpdateUserInfoParams>({
  write: async (params) => {
    return api.put("user", {
      json: {
        user: params,
      },
    });
  },
});

export const useUpdateUserInfo = () => {
  return useOptimisticMutation({
    mutation: updateUserInfo,
    onOptimistic: (ch, params) => {
      return ch(meEntity).update((me) => {
        me.bio = params.bio;
        me.receivesMessagesFromAnyone = params.receivesMessagesFromAnyone;
        me.links = params.links;
      });
    },
  });
};
