import type { RelightSocialPostParams } from "@/features/social/mutations/use-relight-social-post";
import { useSocialPosts } from "@/features/social/queries/use-social-posts";
import { useMe } from "@/features/auth/queries/use-me";
import { WritableDraft } from "immer";

export const relightSocialPost =
  (author: Author, params: RelightSocialPostParams) =>
  (post: WritableDraft<Optimistic<SocialPost>>) => {
    post.relitsCount += params.isRelighted ? 1 : -1;

    if (params.isRelighted) {
      post.relits = post.relits || {};
      post.relits[author.fbId] = true;
    } else if (!params.isRelighted) {
      delete post.relits?.[author.fbId];
    }
  };

export const useSocialFeedRelightUpdates = () => {
  const { data: me } = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts();

  return [
    async (params: RelightSocialPostParams) => {
      return await socialFeed.update(params.id, relightSocialPost(me!, params));
    },
  ];
};
