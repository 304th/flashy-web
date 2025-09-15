import { api } from "@/services/api";
import { createMutation } from "@/lib/mutation";
import { type OptimisticUpdate, useOptimisticMutation } from "@/lib/query.v3";

export interface AddReactionParams {
  id: string;
  postType: PostType;
  reactionType: ReactionType;
  count?: number;
}

const addReaction = createMutation<AddReactionParams>({
  writeToSource: async (params) => {
    return await api
      .post("reactions/addReaction", {
        json: {
          postId: params.id,
          postType: params.postType,
          reactionType: params.reactionType,
          count: params.count ?? 1,
        },
      })
      .json();
  },
});

export const useAddReaction = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<AddReactionParams>[];
}) => {
  return useOptimisticMutation({
    mutation: addReaction,
    optimisticUpdates,
  });
};
