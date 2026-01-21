import { useMe } from "@/features/auth/queries/use-me";
import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import {
  socialFeedCollection,
  type SocialPostPage,
} from "@/features/social/collections/social-feed";

const PAGE_LIMIT = 50;

export const useSocialPosts = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<
    SocialPost,
    { userId?: string; limit: number; cursor: number | null }
  >({
    collection: socialFeedCollection,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) => ({
      pageParam,
      userId: me?.fbId,
      limit: PAGE_LIMIT,
      cursor: pageParam === 1 ? null : (pageParam as unknown as number | null),
    }),
    options: {
      initialPageParam: 1 as unknown as number,
      getNextPageParam: (lastPage: SocialPostPage) => {
        // Use cursor from API response for next page
        if (lastPage.hasMore && lastPage.nextCursor) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
    },
  });
};
