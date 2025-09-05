import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { updateQueryData } from "@/features/comments/queries/useComments";
import type { AddLikeParams } from "@/features/reactions/queries/useAddLike";

export const useLikeCommentMutate = (postId: string) => {
  const queryClient = useQueryClient();

  return updateQueryData<AddLikeParams>(
    queryClient,
    (paginatedComments, params) => {
      return produce(paginatedComments, (draft) => {
        draft.pages.forEach((page) => {
          page.forEach((comment) => {
            if (comment._id === params.id) {
              comment.isLiked = params.isLiked;
              comment.likesCount += params.isLiked ? 1 : -1;
            }
          });
        });
      });
    },
    postId,
  );
};
