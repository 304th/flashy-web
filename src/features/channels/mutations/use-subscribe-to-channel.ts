import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { subscriptionsEntity } from "@/features/auth/queries/use-subscriptions";
import { channelEntity } from "@/features/channels/queries/use-channel-by-id";
import { meEntity } from "@/features/auth/queries/use-me";

export interface SubscribeParams {
  channelId: string;
}

const subscribeMutation = createMutation<SubscribeParams>({
  write: async (params) => {
    return await api
      .post("followUser", {
        json: {
          followingId: params.channelId,
        },
      })
      .json();
  },
});

export const useSubscribeToChannel = () => {
  return useOptimisticMutation({
    mutation: subscribeMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(subscriptionsEntity).update((subs) => {
          subs.push(params.channelId);
        }),
        ch(channelEntity).update((channel) => {
          channel.followersCount = (channel.followersCount || 0) + 1;
        }),
        ch(meEntity).update((me) => {
          me.followingCount = (me.followingCount || 0) + 1;
        }),
      ]);
    },
  });
};
