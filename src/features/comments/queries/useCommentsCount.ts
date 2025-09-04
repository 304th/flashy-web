import { getQuery, handleOptimisticUpdate } from "@/lib/query";
import { api } from "@/services/api";
import type { CommentResponse } from "@/features/comments/queries/useComments";
import type { QueryClient } from "@tanstack/react-query";

export const useCommentsCount = (id: string) =>
  getQuery<number>(["commentsCount", id], async () => {
    const data = await api.get(`comments/${id}?skip=0`).json<CommentResponse>();

    return data?.commentCount || 0;
  });

export const updateQueryData = <T>(
  queryClient: QueryClient,
  mutate: (state: number, variables: T) => number,
  id: string,
) =>
  handleOptimisticUpdate<number, T>(queryClient)({
    queryKey: ["commentsCount", id],
    mutate,
  });
