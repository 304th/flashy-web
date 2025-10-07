import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection, socialFeedCollectionV2 } from "@/features/social/collections/social-feed";
import { usePartitionedQuery } from "@/lib/query-toolkit";
import { usePartitionedQuery as usePartitionedQueryV2 } from "@/lib/query-toolkit-v2";

export const useSocialPosts = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<SocialPost, { userId?: string }>({
    collection: socialFeedCollection,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) => ({ pageParam, userId: me?.fbId }),
  });
};

export const useSocialPostsV2 = () => {
  const { data: me } = useMe();

  return usePartitionedQueryV2<SocialPost, { userId?: string }>({
    collection: socialFeedCollectionV2,
    queryKey: ["social", me?.fbId],
    getParams: ({ pageParam }) => ({ pageParam, userId: me?.fbId }),
  });
};
