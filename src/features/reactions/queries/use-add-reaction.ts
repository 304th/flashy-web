import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import {
  type OptimisticUpdate,
  useOptimisticMutation,
} from "@/lib/query-toolkit";
import {
  createMutation as createMutationV2,
  useOptimisticMutation as useOptimisticMutationV2,
} from "@/lib/query-toolkit-v2";

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

const addReactionV2 = createMutationV2<AddReactionParams>({
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

export const useAddReactionV2 = () => {
  return useOptimisticMutationV2({
    mutation: addReactionV2,
    onOptimistic: (channel, params) => {
      return channel('').update(params.id, (entity) => {

      })
    },
  });
};
