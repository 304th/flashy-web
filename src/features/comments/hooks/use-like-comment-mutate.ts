import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { optimisticUpdateComments } from "@/features/comments/queries/use-comments";
import type { AddLikeParams } from "@/features/reactions/queries/use-add-like";

export const useLikeCommentMutate = (postId: string) => {
  const queryClient = useQueryClient();

  return optimisticUpdateComments<AddLikeParams>(
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
