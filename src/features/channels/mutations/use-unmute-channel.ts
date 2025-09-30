import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { api } from "@/services/api";
import type { MuteChannelParams } from "@/features/channels/mutations/use-mute-channel";
import { useMe } from "@/features/auth/queries/use-me";

export interface UnmuteChannelParams {
  userId: string;
}

const unmuteChannelMutation = createMutation<UnmuteChannelParams>({
  writeToSource: async (params) => {
    return api.post("users/unmute", {
      json: {
        userId: params.userId,
      },
    });
  },
});

export const useUnmuteChannel = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<UnmuteChannelParams>[];
} = {}) => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: unmuteChannelMutation,
    optimisticUpdates: [
      async (params: MuteChannelParams) => {
        return await me.update((meUser) => {
          const foundIndex = meUser?.mutedUsers?.findIndex?.(
            (id) => id === params.userId,
          );

          if (typeof foundIndex === "number" && foundIndex !== -1) {
            meUser.mutedUsers?.splice?.(foundIndex, 1);
          }
        });
      },
      ...(optimisticUpdates || []),
    ],
  });
};
