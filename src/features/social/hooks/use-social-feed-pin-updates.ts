import type { WritableDraft } from "immer";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import type { PinSocialPostParams } from "@/features/social/mutations/use-pin-social-post";
import { useMe } from "@/features/auth/queries/use-me";

export const pinPost =
  (author: Author, params: PinSocialPostParams) =>
  (post: WritableDraft<Optimistic<SocialPost>>) => {
    if (params.pinned) {
      post.pinned = true;
      post.pinnedBy = {
        userId: author!.fbId,
        username: author!.username,
      };
    } else {
      post.pinned = false;
      delete post.pinnedBy;
    }
  };

export const useSocialFeedPinUpdates = () => {
  const { data: me } = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: PinSocialPostParams) => {
      return await socialFeed.update(params.id, pinPost(me!, params));
    },
    async (params: PinSocialPostParams) => {
      return await socialFeed.move(params.id, 0);
    },
  ];
};
