import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { handleOptimisticSuccess, handleOptimisticUpdate } from "@/lib/query";
import { useMe } from "@/features/auth/queries/use-me";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { usePartitionedQuery } from "@/lib/query.v3";

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

export const optimisticUpdateSocialPosts = <T>(
  queryClient: QueryClient,
  mutate: (
    state: Paginated<Optimistic<SocialPost>[]>,
    variables: T,
  ) => Paginated<Optimistic<SocialPost>[]>,
  userId?: string,
) =>
  handleOptimisticUpdate<Paginated<Optimistic<SocialPost>[]>, T>(queryClient)({
    queryKey: ["social", userId],
    mutate,
  });

export const syncSocialPostsOnSuccess = (
  queryClient: QueryClient,
  update: (
    state: Paginated<Optimistic<SocialPost>[]>,
    entity: SocialPost,
  ) => Paginated<Optimistic<SocialPost>[]>,
  userId?: string,
) =>
  handleOptimisticSuccess<Paginated<SocialPost[]>, SocialPost>(queryClient)({
    queryKey: ["social", userId],
    update,
  });
