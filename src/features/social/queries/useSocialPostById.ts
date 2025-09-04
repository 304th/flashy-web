import {api} from "@/services/api";
import {getQuery, handleOptimisticUpdate} from "@/lib/query";
import type {QueryClient} from "@tanstack/react-query";

export const useSocialPostById = (id: string) => getQuery(['social', id], async () => {
  return await api.get(`social-post-item/${id}`).json<SocialPost>()
})

export const updateQueryData = <T>(
  queryClient: QueryClient,
  mutate: (state: SocialPost, variables: T) => SocialPost,
  id: string
) =>
  handleOptimisticUpdate<SocialPost, T>(queryClient)({
    queryKey: ["social", id],
    mutate,
  });