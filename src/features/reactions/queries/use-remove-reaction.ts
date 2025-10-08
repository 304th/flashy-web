import type {WritableDraft} from "immer";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollectionV2 } from "@/features/social/collections/social-feed";
import { socialPostEntityV2 } from "@/features/social/queries/use-social-post-by-id";

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

export const deleteReactionFromSocialPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    delete post.reactions.like[author.fbId];
  };

export const useRemoveReaction = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: removeReaction,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(socialFeedCollectionV2).update(params.id, deleteReactionFromSocialPost(author!)),
        ch(socialPostEntityV2).update(params.id, deleteReactionFromSocialPost(author!)),
      ])
    },
  });
};
