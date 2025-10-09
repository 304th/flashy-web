import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { subscriptionsEntity } from "@/features/auth/queries/use-subscriptions";
import { channelEntity } from "@/features/channels/queries/use-channel-by-id";
import { meEntity } from "@/features/auth/queries/use-me";

export interface UnsubscribeParams {
  channelId: string;
}

const unsubscribeMutation = createMutation<UnsubscribeParams>({
  write: async (params) => {
    return await api
      .post("unfollowUser", {
        json: {
          userId: params.channelId,
        },
      })
      .json();
  },
});

export const useUnsubscribeFromChannel = () => {
  return useOptimisticMutation({
    mutation: unsubscribeMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(subscriptionsEntity).update((subs) => {
          const foundIndex = subs.findIndex(
            (item) => item === params.channelId,
          );

          if (foundIndex !== -1) {
            subs.splice(foundIndex, 1);
          }
        }),
        ch(channelEntity).update((channel) => {
          channel.followersCount = Math.max(
            (channel.followersCount || 0) - 1,
            0,
          );
        }),
        ch(meEntity).update((me) => {
          me.followingCount = Math.max((me.followingCount || 0) - 1, 0);
        }),
      ]);
    },
  });
};
