import {
  createMutation,
  OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useSubscriptions } from "@/features/auth/queries/use-subscriptions";
import { channel } from "node:diagnostics_channel";

export interface SubscribeParams {
  channelId: string;
}

const subscribeMutation = createMutation<SubscribeParams>({
  writeToSource: async (params) => {
    return await api
      .post("followUser", {
        json: {
          followingId: params.channelId,
        },
      })
      .json();
  },
});

export const useSubscribeToChannel = ({
  optimisticUpdates,
}: { optimisticUpdates?: OptimisticUpdate<SubscribeParams>[] } = {}) => {
  const { optimisticUpdates: subscriptions } = useSubscriptions();

  return useOptimisticMutation({
    mutation: subscribeMutation,
    optimisticUpdates: [
      async (params) => {
        return subscriptions.update((subs) => {
          subs.push(params.channelId);
        });
      },
      ...(optimisticUpdates || []),
    ],
  });
};
