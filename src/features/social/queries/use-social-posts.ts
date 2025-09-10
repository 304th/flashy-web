import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  getInfiniteQuery,
  handleOptimisticSuccess,
  handleOptimisticUpdate,
} from "@/lib/query";
import { useMe } from "@/features/auth/queries/use-me";
import { decodePollResults } from "@/features/social/utils/poll";

export const useSocialPosts = () => {
  const [me] = useMe();

  return getInfiniteQuery<Optimistic<SocialPost>[]>(
    ["social", me?.fbId],
    async () => {
      const socialPosts = await api
        .get(me?.fbId ? "relevant-social-posts" : "anonymous/social-posts")
        .json<SocialPost[]>();

      //FIXME: fix poll logic
      return socialPosts.map((socialPost) => ({
        ...socialPost,
        poll: {
          ...socialPost.poll,
          results: decodePollResults(socialPost.poll),
        },
      }));
    },
  );
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
