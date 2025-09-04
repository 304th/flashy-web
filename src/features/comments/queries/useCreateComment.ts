import { useQueryClient } from "@tanstack/react-query";
import {getMutation, handleMutationError, handleOptimisticUpdateError} from "@/lib/query";
import { api } from "@/services/api";

export interface CreateCommentParams {
  postId: string;
  postType: string;
  message: string;
}

//FIXME: refactor on backend
export const useCreateComment = (options?: {
  onMutate?: (variables: CreateCommentParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["createComment"],
    async (params: CreateCommentParams) => {
      return
      return api
        .post("comment", {
          json: {
            itemMongoKey: params.postId,
            itemType: params.postType,
            mentionedUsers: [],
            commentFormKey: `reply_first_${params.postId}`,
            comment: { text: params.message },
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
