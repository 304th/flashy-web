import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UnmuteChannelParams {
  userId: string;
}

const unmuteChannelMutation = createMutation<UnmuteChannelParams>({
  write: async (params) => {
    return api.post("users/unmute", {
      json: {
        userId: params.userId,
      },
    });
  },
});

export const useUnmuteChannel = () => {
  return useOptimisticMutation({
    mutation: unmuteChannelMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(meEntity).update((me) => {
          const foundIndex = me?.mutedUsers?.findIndex?.(
            (id) => id === params.userId,
          );

          if (typeof foundIndex === "number" && foundIndex !== -1) {
            me.mutedUsers?.splice?.(foundIndex, 1);
          }
        }),
      ]);
    },
  });
};
