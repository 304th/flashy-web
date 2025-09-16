import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import { OptimisticUpdate, useOptimisticMutation } from "@/lib/query-toolkit";

export interface RemoveReactionParams {
  id: string;
  postType: PostType;
  reactionType: string;
}

const removeReaction = createMutation<RemoveReactionParams>({
  writeToSource: async (params) => {
    return await api
      .delete("reactions/deleteReaction", {
        json: {
          postId: params.id,
          postType: params.postType,
          reactionType: params.reactionType,
        },
      })
      .json();
  },
});

export const useRemoveReaction = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<RemoveReactionParams>[];
}) => {
  return useOptimisticMutation({
    mutation: removeReaction,
    optimisticUpdates,
  });
};
