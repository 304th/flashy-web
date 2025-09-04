import { getInfiniteQuery, handleOptimisticUpdate } from "@/lib/query";
import { api } from "@/services/api";
import type { QueryClient } from "@tanstack/react-query";

export interface CommentResponse {
  comment: CommentPost[];
  commentCount: number;
}

export const useComments = (id: string) =>
  getInfiniteQuery<CommentPost[]>(["comments", id], async ({ pageParam }) => {
    const data = await api
      .get(`comments/${id}?skip=${pageParam - 1}`)
      .json<CommentResponse>();

    return data?.comment || [];
  });

export const updateQueryData = <T>(
  queryClient: QueryClient,
  mutate: (
    state: Paginated<CommentPost[]>,
    variables: T,
  ) => Paginated<CommentPost[]>,
  id: string,
) =>
  handleOptimisticUpdate<Paginated<CommentPost[]>, T>(queryClient)({
    queryKey: ["comments", id],
    mutate,
  });
