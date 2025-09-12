import { api } from "@/services/api";
import { getQuery, handleOptimisticUpdate } from "@/lib/query";
import type { QueryClient } from "@tanstack/react-query";

export const useReplies = (commentId: string) =>
  getQuery(["replies", commentId], async () => {
    return await api.get(`commentReplies/${commentId}`).json<Reply[]>();
  });

export const optimisticUpdateReplies = <T>(
  queryClient: QueryClient,
  mutate: (state: Reply[], variables: T) => Reply[],
  id: string,
) =>
  handleOptimisticUpdate<Reply[], T>(queryClient)({
    queryKey: ["replies", id],
    mutate,
  });
