import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";

export interface TipChannelParams {
  channelId: string;
  amount: string;
  post: {
    type: string;
    id: string;
    title: string;
  }
}

const tipChannelMutation = createMutation<TipChannelParams>({
  write: async (params) => {
    return api
      .post("/social-posts/tip", {
        json: {
          user_id: params.channelId,
          value: params.amount,
          entity: { type: params.post.type, id: params.post.id, title: params.post.title },
        },
      })
      .json();
  }
})

export const useTipChannel = () => {
  return useOptimisticMutation({
    mutation: tipChannelMutation,
  })
}