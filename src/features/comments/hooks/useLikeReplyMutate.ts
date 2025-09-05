import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { updateQueryData } from "@/features/comments/queries/useReplies";
import type {AddLikeParams} from "@/features/reactions/queries/useAddLike";

export const useLikeReplyMutate = (commentId: string) => {
  const queryClient = useQueryClient();

  return updateQueryData<AddLikeParams>(
    queryClient,
    (replies, params) => {
      return produce(replies, (draft) => {
        draft.forEach((reply) => {
          if (reply._id === params.id) {
            reply.isLiked = params.isLiked
            reply.likesCount += (params.isLiked ? 1 : -1);
          }
        });
      });
    },
    commentId,
  );
};
