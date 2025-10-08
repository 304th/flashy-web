import { api } from "@/services/api";
import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { commentsCollection } from "@/features/comments/collections/comments";
import { repliesCollection } from "@/features/comments/collections/replies";

export interface AddLikeParams {
  id: string;
  isLiked: boolean;
}

const addLike = createMutation<AddLikeParams>({
  write: async (params) => {
    return await api
      .post("comment/like", {
        json: {
          _id: params.id,
          isLiked: params.isLiked,
        },
      })
      .json();
  },
});

export const useAddLike = () => {
  return useOptimisticMutation({
    mutation: addLike,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(commentsCollection).update(params.id, (comment) => {
          comment.isLiked = params.isLiked;
          comment.likesCount += params.isLiked ? 1 : -1;
        }),
        ch(repliesCollection).update(params.id, (comment) => {
          comment.isLiked = params.isLiked;
          comment.likesCount += params.isLiked ? 1 : -1;
        }),
      ]);
    },
  });
};
