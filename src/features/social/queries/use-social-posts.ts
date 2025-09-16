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

  // return getInfiniteQueryV2<SocialPost>({
  //   queryKey: ["social", me?.fbId],
  //   queryFn: async () => {
  //     const socialPosts = await api
  //       .get(me?.fbId ? "relevant-social-posts" : "anonymous/social-posts")
  //       .json<SocialPost[]>();
  //
  //     //FIXME: fix poll logic
  //     return socialPosts.map((socialPost) => ({
  //       ...socialPost,
  //       poll: {
  //         ...socialPost.poll,
  //         results: decodePollResults(socialPost.poll),
  //       },
  //     }));
  //   },
  //   schema:
  // });
};
