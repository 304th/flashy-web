import { useMe } from "@/features/auth/queries/use-me";
import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { socialFeedCollection } from "@/features/social/collections/social-feed";

const PAGE_LIMIT = 15;

export const useSocialPosts = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<
    SocialPost,
    { userId?: string; limit: number; skip: number }
  >({
    collection: socialFeedCollection,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) =>
      ({
        userId: me?.fbId,
        limit: PAGE_LIMIT,
        skip: (pageParam - 1) * PAGE_LIMIT,
      }) as any,
  });
};
