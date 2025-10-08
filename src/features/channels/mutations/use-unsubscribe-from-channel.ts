import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { subscriptionsEntity } from "@/features/auth/queries/use-subscriptions";

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
      return ch(subscriptionsEntity).update((subs) => {
        const foundIndex = subs.findIndex((item) => item === params.channelId);

        if (foundIndex !== -1) {
          subs.splice(foundIndex, 1);
        }
      });
    },
  });
};
