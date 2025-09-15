import { api } from "@/services/api";
import { createMutation } from "@/lib/mutation";
import { type OptimisticUpdate, useOptimisticMutation } from "@/lib/query.v3";

export interface CreateCommentParams {
  postId: string;
  postType: string;
  text: string;
  mentionedUsers: string[];
}

const createComment = createMutation({
  writeToSource: async (params: CreateCommentParams) => {
    const data = await api
      .post("comment", {
        json: {
          itemMongoKey: params.postId,
          itemType: params.postType,
          mentionedUsers: params.mentionedUsers,
          commentFormKey: `reply_first_${params.postId}`,
          comment: { text: params.text },
        },
      })
      .json<{ response: CommentPost }>();

    return data.response;
  },
});

export const useCreateComment = ({
  optimisticUpdates,
}: {
  optimisticUpdates?: OptimisticUpdate<CreateCommentParams>[];
}) => {
  return useOptimisticMutation({
    mutation: createComment,
    optimisticUpdates,
  });
};
