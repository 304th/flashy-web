import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { blazeBalanceEntity } from "@/features/wallet/entities/blaze-balance.entity";

export interface BuyKeyParams {
  channelId: string;
}

const buyKeyMutation = createMutation<BuyKeyParams>({
  write: async (params) => {
    return api.post(`/keys/buy/${params.channelId}?buyToken=blaze`)
  }
})

export const useBuyKey = () => {
  return useOptimisticMutation({
    mutation: buyKeyMutation,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(blazeBalanceEntity).update((balance) => {
          balance.blaze = '0.0';
        })
      ])
    }
  })
}