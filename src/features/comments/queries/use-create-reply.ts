import { api } from "@/services/api";
import { createMutation } from "@/lib/mutation";
import { type OptimisticUpdate, useOptimisticMutation } from "@/lib/query.v3";

export interface CreateReplyParams {
  commentId: string;
  mentionedUsers: string[];
  text: string;
}

const createReply = createMutation<CreateReplyParams>({
  writeToSource: async (params) => {
    const data = await api
      .post("reply", {
        json: {
          mentionedUsers: params.mentionedUsers,
          reply: {
            parentCommentId: params.commentId,
            text: params.text,
          },
        },
      })
      .json<{ response: Reply }>();

    return data.response;
  },
});

export const useCreateReply = ({
  optimisticUpdates,
}: { optimisticUpdates?: OptimisticUpdate<CreateReplyParams>[] } = {}) =>
  useOptimisticMutation({
    mutation: createReply,
    optimisticUpdates,
  });
