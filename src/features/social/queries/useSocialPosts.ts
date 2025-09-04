import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getInfiniteQuery, handleOptimisticUpdate } from "@/lib/query";

export const useSocialPosts = () => {
  return getInfiniteQuery<SocialPost[]>(["social"], async () => {
    return await api.get("relevant-social-posts").json();
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
