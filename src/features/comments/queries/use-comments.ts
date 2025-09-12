import {
  getInfiniteQuery,
  handleOptimisticSuccess,
  handleOptimisticUpdate,
} from "@/lib/query";
import { api } from "@/services/api";
import type { QueryClient } from "@tanstack/react-query";

export interface CommentResponse {
  comment: CommentPost[];
  commentCount: number;
}

export const useComments = (id: string) =>
  getInfiniteQuery<Optimistic<CommentPost>[]>(
    ["comments", id],
    async ({ pageParam }) => {
      const data = await api
        .get(`comments/${id}?skip=${pageParam - 1}`)
        .json<CommentResponse>();

      return data?.comment || [];
    },
  );

export const optimisticUpdateComments = <T>(
  queryClient: QueryClient,
  mutate: (
    state: Paginated<Optimistic<CommentPost>[]>,
    variables: T,
  ) => Paginated<Optimistic<CommentPost>[]>,
  postId: string,
) =>
  handleOptimisticUpdate<Paginated<Optimistic<CommentPost>[]>, T>(queryClient)({
    queryKey: ["comments", postId],
    mutate,
  });

export const syncCommentsOnSuccess = (
  queryClient: QueryClient,
  update: (
    state: Paginated<Optimistic<CommentPost>[]>,
    entity: CommentPost,
  ) => Paginated<Optimistic<CommentPost>[]>,
  postId?: string,
) =>
  handleOptimisticSuccess<Paginated<CommentPost[]>, CommentPost>(queryClient)({
    queryKey: ["comments", postId],
    update,
  });
