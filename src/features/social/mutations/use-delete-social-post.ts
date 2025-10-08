import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { socialFeedCollection } from "@/features/social/collections/social-feed";

export interface DeleteSocialPostParams {
  id: string;
}

const deleteSocialPost = createMutation<DeleteSocialPostParams>({
  write: async (params: DeleteSocialPostParams) => {
    api.delete(`social-posts`, {
      json: {
        post_id: params.id,
      },
    });
  },
});

export const useDeleteSocialPost = () => {
  return useOptimisticMutation({
    mutation: deleteSocialPost,
    onOptimistic: (ch, params) => {
      return ch(socialFeedCollection).delete(params.id);
    },
  });
};
