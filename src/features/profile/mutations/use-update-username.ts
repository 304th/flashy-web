import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UpdateUsernameParams {
  username: string;
}

const updateUsername = createMutation<UpdateUsernameParams>({
  write: async (params) => {
    return api.put("usernameChange", {
      json: params,
    });
  },
});

export const useUpdateUsername = () => {
  return useOptimisticMutation({
    mutation: updateUsername,
    onOptimistic: (ch, params) => {
      return ch(meEntity).update((me) => {
        me.username = params.username;
      });
    },
  });
};
