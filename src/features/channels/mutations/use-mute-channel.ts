import { api } from "@/services/api";
import {
  createMutation,
  useOptimisticMutation,
} from "@/lib/query-toolkit-v2";
import { meEntity } from "@/features/auth/queries/use-me";
import { socialFeedCollectionV2 } from "@/features/social/collections/social-feed";

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

export const useMuteChannel = () => {
  return useOptimisticMutation({
    mutation: muteChannelMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(meEntity).update((me) => {
          me.mutedUsers = me.mutedUsers || [];
          me.mutedUsers.push(params.userId);
        }),
        // ch(socialFeedCollectionV2).update(params.userId)
      ])
    },
  });
};
