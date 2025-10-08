import type { WritableDraft } from "immer";
import { api } from "@/services/api";
import {
  createMutation as createMutationV2,
  useOptimisticMutation as useOptimisticMutationV2,
} from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { socialPostEntity } from "@/features/social/queries/use-social-post-by-id";

export interface AddReactionParams {
  id: string;
  postType: PostType;
  reactionType: ReactionType;
  count?: number;
}

const addReaction = createMutationV2<AddReactionParams>({
  write: async (params) => {
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

export const addReactionToSocialPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.reactions = post.reactions || { like: {} };
    post.reactions.like = post.reactions.like || {};

    post.reactions.like[author.fbId] = {
      fbId: author.fbId,
      username: author.username,
      userimage: author.userimage,
    };
  };

export const useAddReaction = () => {
  const { data: author } = useMe();

  return useOptimisticMutationV2({
    mutation: addReaction,
    onOptimistic: async (channel, params) => {
      return Promise.all([
        channel(socialFeedCollection).update(
          params.id,
          addReactionToSocialPost(author!),
        ),
        channel(socialPostEntity).update(
          params.id,
          addReactionToSocialPost(author!),
        ),
      ]);
    },
  });
};
