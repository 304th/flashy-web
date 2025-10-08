import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { commentsCollection } from "@/features/comments/collections/comments";

export interface DeleteCommentParams {
  id: string;
}

const deleteComment = createMutation({
  write: async (params: DeleteCommentParams) => {
    return api
      .delete("comment", {
        json: {
          _id: params.id,
        },
      })
      .json();
  },
});

export const useDeleteComment = () => {
  return useOptimisticMutation({
    mutation: deleteComment,
    onOptimistic: (ch, params) => {
      return Promise.all([ch(commentsCollection).delete(params.id)]);
    },
  });
};
