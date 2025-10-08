import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { subscriptionsEntity } from "@/features/auth/queries/use-subscriptions";

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
      return ch(subscriptionsEntity).update((subs) => {
        subs.push(params.channelId);
      });
    },
  });
};
