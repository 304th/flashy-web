import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useMe } from "@/features/auth/queries/use-me";
import { updateQueryData as updateRepliesQuery } from "@/features/comments/queries/useReplies";
import { updateQueryData as updateCommentsQuery } from "@/features/comments/queries/useComments";
import type { CreateReplyParams } from "@/features/comments/queries/useCreateReply";
import { combineOptimisticUpdates, OptimisticUpdater } from "@/lib/query";
import { createOptimisticReply } from "@/features/comments/utils/createOptimisticReply";

export const useCreateReplyMutate = (
  postId: string,
  commentId?: string,
  mutates?: OptimisticUpdater[],
) => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  if (!commentId) return [];

  const updates = [
    updateRepliesQuery<CreateReplyParams>(
      queryClient,
      (paginatedComments, params) => {
        return produce(paginatedComments, (draft) => {
          draft.unshift(createOptimisticReply(params, me!));
        });
      },
      commentId,
    ),
    updateCommentsQuery<CreateReplyParams>(
      queryClient,
      (paginatedComments, params) => {
        return produce(paginatedComments, (draft) => {
          draft.pages.forEach((page) => {
            page.forEach((comment) => {
              if (comment._id === params.commentId) {
                comment.repliesCount += 1;
              }
            });
          });
        });
      },
      postId,
    ),
  ];

  if (mutates) {
    updates.push(...(mutates.filter(Boolean) as OptimisticUpdater[]));
  }

  return combineOptimisticUpdates<CreateReplyParams>(updates);
};
