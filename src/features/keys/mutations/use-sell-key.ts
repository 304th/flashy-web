import { useQueryClient } from "@tanstack/react-query";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { boughtKeysEntity } from "@/features/keys/entities/bought-keys.entity";

export interface SellKeyParams {
  channelId: string;
  buyToken: WalletToken;
}

const sellKeyMutation = createMutation<SellKeyParams>({
  write: async (params) => {
    return api.post(
      `keys/sell/${params.channelId}?buyToken=${params.buyToken}`,
    );
  },
});

export const useSellKey = () => {
  const queryClient = useQueryClient();
  const { data: me } = useMe();

  return useOptimisticMutation({
    mutation: sellKeyMutation,
    onSuccess: (_, channel, params) => {
      void queryClient.invalidateQueries({
        queryKey: ["keys", params.channelId, "price"],
        refetchType: "all",
      });
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
      void channel(boughtKeysEntity).update((boughtKeys) => {
        const foundIndex = boughtKeys.findIndex(
          (item) => item === params.channelId,
        );

        if (foundIndex !== -1) {
          boughtKeys.splice(foundIndex, 1);
        }
      });
    },
  });
};
