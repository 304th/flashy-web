import { useQueryClient } from "@tanstack/react-query";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { subscriptionsEntity } from "@/features/auth/queries/use-subscriptions";
import { boughtKeysEntity } from "@/features/keys/entities/bought-keys.entity";

export interface BuyKeyParams {
  channelId: string;
  buyToken: WalletToken;
}

const buyKeyMutation = createMutation<BuyKeyParams>({
  write: async (params) => {
    return api.post(`keys/buy/${params.channelId}?buyToken=${params.buyToken}`);
  },
});

export const useBuyKey = () => {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useOptimisticMutation({
    mutation: buyKeyMutation,
    onSuccess: (_, channel, params) => {
      void queryClient.invalidateQueries({
        queryKey: ["me", "wallet", "balance"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["social", me?.fbId],
        refetchType: "all",
      });
      void queryClient.invalidateQueries({
        queryKey: ["channel", params.channelId],
        refetchType: "all",
      });
      void queryClient.invalidateQueries({
        queryKey: ["keys", params.channelId, "price"],
        refetchType: "all",
      });
      void channel(boughtKeysEntity).update((boughtKeys) => {
        boughtKeys.push(params.channelId);
      });
    },
  });
};
