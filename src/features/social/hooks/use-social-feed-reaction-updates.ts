import { useMe } from "@/features/auth/queries/use-me";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import type { AddReactionParams } from "@/features/reactions/queries/use-add-reaction";
import type { RemoveReactionParams } from "@/features/reactions/queries/use-remove-reaction";

export const useSocialFeedUpdatesOnReactionAdd = () => {
  const [me] = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: AddReactionParams) => {
      return await socialFeed.update(params.id, (post) => {
        post.reactions = post.reactions || { like: {} };
        post.reactions.like = post.reactions.like || {};

        post.reactions.like[me!.fbId] = {
          fbId: me!.fbId,
          username: me!.username,
          userimage: me!.userimage,
        };
      });
    },
  ];
};

export const useSocialFeedUpdatesOnReactionRemove = () => {
  const [me] = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: RemoveReactionParams) => {
      return await socialFeed.update(params.id, (post) => {
        delete post.reactions.like[me!.fbId];
      });
    },
  ];
};
