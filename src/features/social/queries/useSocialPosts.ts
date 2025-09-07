import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getInfiniteQuery, handleOptimisticUpdate } from "@/lib/query";
import { decodePollResults } from "@/features/social/utils/poll";

export const useSocialPosts = () => {
  return getInfiniteQuery<SocialPost[]>(["social"], async () => {
    const socialPosts = await api
      .get("relevant-social-posts")
      .json<SocialPost[]>();

    return socialPosts.map((socialPost) => ({
      //FIXME: fix poll logic
      ...socialPost,
      poll: {
        ...socialPost.poll,
        results: decodePollResults(socialPost.poll),
      },
    }));
  });
};

export const updateQueryData = <T>(
  queryClient: QueryClient,
  mutate: (
    state: Paginated<SocialPost[]>,
    variables: T,
  ) => Paginated<SocialPost[]>,
) =>
  handleOptimisticUpdate<Paginated<SocialPost[]>, T>(queryClient)({
    queryKey: ["social"],
    mutate,
  });
