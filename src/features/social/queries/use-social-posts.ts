import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { usePartitionedQuery } from "@/lib/query-toolkit";

export const useSocialPosts = () => {
  const [me] = useMe();

  return usePartitionedQuery<SocialPost, { userId?: string }>({
    collection: socialFeedCollection,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) => ({ pageParam, userId: me?.fbId }),
  });
};
