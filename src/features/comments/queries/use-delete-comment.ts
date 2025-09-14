import { useQueryClient } from "@tanstack/react-query";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";
import { api } from "@/services/api";

export interface DeleteCommentParams {
  id: string;
}

export const useDeleteComment = (options?: {
  onMutate?: (variables: DeleteCommentParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation<CommentPost, Error, DeleteCommentParams>(
    ["deleteComment"],
    async (params: DeleteCommentParams) => {
      return api
        .delete("comment", {
          json: {
            _id: params.id,
          },
        })
        .json();
    },
    {
      onMutate: options?.onMutate,
      onError: handleOptimisticUpdateError(queryClient),
    },
  );
};
