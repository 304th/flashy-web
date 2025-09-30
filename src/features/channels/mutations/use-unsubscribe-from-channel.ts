import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useSubscriptions } from "@/features/auth/queries/use-subscriptions";

export interface UnsubscribeParams {
  channelId: string;
}

const unsubscribeMutation = createMutation<UnsubscribeParams>({
  writeToSource: async (params) => {
    return await api
      .post("unfollowUser", {
        json: {
          userId: params.channelId,
        },
      })
      .json();
  },
});

export const useUnsubscribeFromChannel = ({
  optimisticUpdates,
}: { optimisticUpdates?: OptimisticUpdate<UnsubscribeParams>[] } = {}) => {
  const { optimisticUpdates: subscriptions } = useSubscriptions();

  return useOptimisticMutation({
    mutation: unsubscribeMutation,
    optimisticUpdates: [
      async (params) => {
        return subscriptions.update((subs) => {
          const foundIndex = subs.findIndex(
            (item) => item === params.channelId,
          );

          if (foundIndex !== -1) {
            subs.splice(foundIndex, 1);
          }
        });
      },
      ...(optimisticUpdates || []),
    ],
  });
};
