import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { syncCommentsOnSuccess } from "@/features/comments/queries/use-comments";

export const useCreateCommentSuccess = (postId: string) => {
  const queryClient = useQueryClient();

  return syncCommentsOnSuccess(
    queryClient,
    (paginatedComments, newCommentPost) => {
      return produce(paginatedComments, (draft) => {
        const old = draft.pages[0][0]; //TODO: to prevent from images disappearing and reappearing

        draft.pages[0][0] = {
          ...newCommentPost,
          _optimisticId: old._optimisticId,
        };
      });
    },
    postId,
  );
};
