import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { optimisticUpdateComments } from "@/features/comments/queries/use-comments";
import { optimisticUpdateCommentsCount } from "@/features/comments/queries/use-comments-count";
import { combineOptimisticUpdates, OptimisticUpdater } from "@/lib/query";
import type { DeleteCommentParams } from "@/features/comments/queries/use-delete-comment";

export const useDeleteCommentMutate = (
  postId: string,
  mutates?: OptimisticUpdater[],
) => {
  const queryClient = useQueryClient();
  const updates = [
    optimisticUpdateComments<DeleteCommentParams>(
      queryClient,
      (paginatedComments, params) => {
        return produce(paginatedComments, (draft) => {
          draft.pages.forEach((page) => {
            const index = page.findIndex(
              (comment) => comment._id === params.id,
            );

            if (index !== -1) {
              page.splice(index, 1);
            }
          });
        });
      },
      postId,
    ),
    optimisticUpdateCommentsCount<DeleteCommentParams>(
      queryClient,
      (commentsCount) => {
        return commentsCount - 1;
      },
      postId,
    ),
  ];

  if (mutates) {
    updates.push(...(mutates.filter(Boolean) as OptimisticUpdater[]));
  }

  return combineOptimisticUpdates<DeleteCommentParams>(updates);
};
