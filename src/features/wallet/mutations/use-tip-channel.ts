import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

export interface TipChannelParams {
  channelId: string;
  amount: number;
  post: {
    type: string;
    id: string;
    title: string;
  };
}

const tipChannelMutation = createMutation<TipChannelParams>({
  write: async (params) => {
    return api
      .post("social-posts/tip", {
        json: {
          user_id: params.channelId,
          value: params.amount,
          entity: {
            type: params.post.type,
            id: params.post.id,
            title: params.post.title,
          },
        },
      })
      .json();
  },
});

export const useTipChannel = () => {
  const queryClient = useQueryClient();

  return useOptimisticMutation({
    mutation: tipChannelMutation,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["me", "wallet", "balance"],
      });
    },
  });
};
