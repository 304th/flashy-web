import { api } from "@/services/api";
import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { useMe } from "@/features/auth/queries/use-me";

export interface MuteChannelParams {
  userId: string;
}

const muteChannelMutation = createMutation<MuteChannelParams>({
  writeToSource: async (params) => {
    return api.post("users/mute", {
      json: {
        userId: params.userId,
      },
    });
  },
});

export const useMuteChannel = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<MuteChannelParams>[];
} = {}) => {
  const { optimisticUpdates: me } = useMe();

  return useOptimisticMutation({
    mutation: muteChannelMutation,
    optimisticUpdates: [
      async (params: MuteChannelParams) => {
        return await me.update((meUser) => {
          meUser.mutedUsers = meUser.mutedUsers || [];
          meUser.mutedUsers.push(params.userId);
        });
      },
      ...(optimisticUpdates || []),
    ],
  });
};
