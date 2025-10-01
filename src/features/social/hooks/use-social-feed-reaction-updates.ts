import type { WritableDraft } from "immer";
import { useMe } from "@/features/auth/queries/use-me";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import type { AddReactionParams } from "@/features/reactions/queries/use-add-reaction";
import type { RemoveReactionParams } from "@/features/reactions/queries/use-remove-reaction";

export const addReactionToPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.reactions = post.reactions || { like: {} };
    post.reactions.like = post.reactions.like || {};

    post.reactions.like[author.fbId] = {
      fbId: author.fbId,
      username: author.username,
      userimage: author.userimage,
    };
  };

export const deleteReactionFromPost =
  (author: Author) => (post: WritableDraft<Optimistic<SocialPost>>) => {
    delete post.reactions.like[author.fbId];
  };

export const useSocialFeedUpdatesOnReactionAdd = () => {
  const { data: me } = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: AddReactionParams) => {
      return await socialFeed.update(params.id, addReactionToPost(me!));
    },
  ];
};

export const useSocialFeedUpdatesOnReactionRemove = () => {
  const { data: me } = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: RemoveReactionParams) => {
      return await socialFeed.update(params.id, deleteReactionFromPost(me!));
    },
  ];
};
