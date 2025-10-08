import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { repliesCollection } from "@/features/comments/collections/replies";

export interface DeleteCommentParams {
  id: string;
}

const deleteComment = createMutation({
  write: async (params: DeleteCommentParams) => {
    return api
      .delete("reply", {
        json: {
          _id: params.id,
        },
      })
      .json();
  },
});

export const useDeleteReply = () => {
  return useOptimisticMutation({
    mutation: deleteComment,
    onOptimistic: (ch, params) => {
      return Promise.all([ch(repliesCollection).delete(params.id)]);
    },
  });
};
