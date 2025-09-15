import type {RelightSocialPostParams} from "@/features/social/queries/use-relight-social-post";
import {useSocialPosts} from "@/features/social/queries/use-social-posts";
import {useMe} from "@/features/auth/queries/use-me";

export const useSocialFeedRelightUpdates = () => {
  const [me] = useMe();
  const { optimisticUpdates: socialFeed } = useSocialPosts()

  return [
    async (params: RelightSocialPostParams) => {
      return await socialFeed.update(params.id, (post) => {
        post.relitsCount += params.isRelighted ? 1 : -1;

        if (params.isRelighted) {
          post.relits = post.relits || {};
          post.relits[me!.fbId] = true;
        } else if (!params.isRelighted) {
          delete post.relits?.[me!.fbId];
        }
      })
    }
  ]
}