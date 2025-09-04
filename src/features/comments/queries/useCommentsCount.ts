import { getQuery } from "@/lib/query";
import { api } from "@/services/api";
import type { CommentResponse } from "@/features/comments/queries/useComments";

export const useCommentsCount = (id: string) =>
  getQuery<number>(["commentsCount", id], async () => {
    const data = await api.get(`comments/${id}?skip=0`).json<CommentResponse>();

    return data?.commentCount || 0;
  });
