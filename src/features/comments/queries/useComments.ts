import { getInfiniteQuery, handleOptimisticUpdate } from "@/lib/query";
import { api } from "@/services/api";
import type { QueryClient } from "@tanstack/react-query";

export interface CommentResponse {
  comment: CommentReply[];
  commentCount: number;
}

export const useComments = (id: string) =>
  getInfiniteQuery<CommentReply[]>(["comments", id], async ({ pageParam }) => {
    const data = await api
      .get(`comments/${id}?skip=${pageParam - 1}`)
      .json<CommentResponse>();

    return data?.comment || [];
  });

export const updateQueryData = <S, T>(
  queryClient: QueryClient,
  mutate: (state: S, variables: T) => S,
  ...args: any[]
) =>
  handleOptimisticUpdate<S, T>(queryClient)({
    queryKey: ["comments", ...args],
    mutate,
  });
