import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useMe } from "@/features/auth/queries/use-me";
import { updateQueryData as updateCommentsQuery } from "@/features/comments/queries/useComments";
import { updateQueryData as updateCommentsCountQuery } from "@/features/comments/queries/useCommentsCount";
import type { CreateCommentParams } from "@/features/comments/queries/use-create-comment";
import { createOptimisticComment } from "@/features/comments/utils/createOptimisticComment";
import { combineOptimisticUpdates, OptimisticUpdater } from "@/lib/query";

export const useCreateCommentMutate = (
  id: string,
  mutates?: OptimisticUpdater[],
) => {
  const [me] = useMe();
  const queryClient = useQueryClient();
  const updates = [
    updateCommentsQuery<CreateCommentParams>(
      queryClient,
      (paginatedComments, params) => {
        return produce(paginatedComments, (draft) => {
          draft.pages[0].unshift(createOptimisticComment(params, me!));
        });
      },
      id,
    ),
    updateCommentsCountQuery<CreateCommentParams>(
      queryClient,
      (commentsCount) => {
        return commentsCount + 1;
      },
      id,
    ),
  ];

  if (mutates) {
    updates.push(...(mutates.filter(Boolean) as OptimisticUpdater[]));
  }

  return combineOptimisticUpdates<CreateCommentParams>(updates);
};
