import { api } from "@/services/api";
import { createMutation } from "@/lib/query-toolkit/mutation";
import { OptimisticUpdate, useOptimisticMutation } from "@/lib/query-toolkit";
import { useOptimisticMutation as useOptimisticMutationV2, createMutation as createMutationV2 } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollectionV2 } from "@/features/social/collections/social-feed";

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

const removeReactionV2 = createMutationV2<RemoveReactionParams>({
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

export const useRemoveReactionV2 = () => {
  const { data: author } = useMe();

  return useOptimisticMutationV2({
    mutation: removeReactionV2,
    onOptimistic: (ch, params) => {
      return ch(socialFeedCollectionV2).update(params.id, (post) => {
        delete post.reactions.like[author!.fbId];
      })
    },
  });
};
