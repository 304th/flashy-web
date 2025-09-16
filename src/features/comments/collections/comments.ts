import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit/collection";
import { commentSchema } from "@/features/comments/schemas/comment.schema";

export interface CommentResponse {
  comment: CommentPost[];
  commentCount: number;
}

export const commentsCollection = createCollection<
  CommentPost,
  { postId?: string; pageParam?: number }
>({
  async sourceFrom({ postId, pageParam = 1 } = {}) {
    const data = await api
      .get(`comments/${postId}?skip=${pageParam - 1}`)
      .json<CommentResponse>();

    return data?.comment || [];
  },
  schema: commentSchema,
});
