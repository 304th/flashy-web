import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export interface UpdateUsernameParams {
  username: string;
}

const updateUsername = createMutation<UpdateUsernameParams>({
  writeToSource: async (params) => {
    return api.put("usernameChange", {
      json: params,
    });
  },
});

export const useUpdateUsername = () => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: updateUsername,
    optimisticUpdates: [
      async (params) => {
        return me.update((meUser) => {
          meUser.username = params.username;
        });
      },
    ],
  });
};
