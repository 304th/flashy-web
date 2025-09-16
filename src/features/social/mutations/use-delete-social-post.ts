import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import { useOptimisticMutation } from "@/lib/query-toolkit";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";

export interface DeleteSocialPostParams {
  id: string;
}

const deleteSocialPost = createMutation<DeleteSocialPostParams>({
  writeToSource: async (params: DeleteSocialPostParams) => {
    api.delete(`social-posts`, {
      json: {
        post_id: params.id,
      },
    });
  },
});

export const useDeleteSocialPost = () => {
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return useOptimisticMutation({
    mutation: deleteSocialPost,
    optimisticUpdates: [async (params) => socialFeed.delete(params.id)],
  });
};
