import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getInfiniteQuery, handleOptimisticUpdate } from "@/lib/query";

export const useSocialPosts = () => {
  return getInfiniteQuery<SocialPost[]>(["social"], async () => {
    return await api.get("relevant-social-posts").json();
  });
};

export const updateQueryData = <S, T>(
  queryClient: QueryClient,
  mutate: (state: S, variables: T) => S,
) =>
  handleOptimisticUpdate<S, T>(queryClient)({
    queryKey: ["social"],
    mutate,
  });
