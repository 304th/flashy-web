import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { replySchema } from "@/features/comments/schemas/reply.schema";

export const repliesCollection = createCollection<
  Reply,
  { commentId?: string; pageParam?: number }
>({
  async sourceFrom({ commentId } = {}) {
    return await api.get(`commentReplies/${commentId}`).json<Reply[]>();
  },
  schema: replySchema,
  name: "replies",
});
