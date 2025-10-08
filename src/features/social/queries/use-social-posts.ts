import { useMe } from "@/features/auth/queries/use-me";
import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { socialFeedCollection } from "@/features/social/collections/social-feed";

export const useSocialPosts = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<SocialPost, { userId?: string }>({
    collection: socialFeedCollection,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) => ({ pageParam, userId: me?.fbId }),
  });
};
