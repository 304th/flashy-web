import { useQueryClient } from "@tanstack/react-query";
import { getMutation, handleMutationError } from "@/lib/query";
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
      onError: (error: any, _, context: any) => {
        if (context.optimisticQueryKey && context.previous) {
          queryClient.setQueryData(
            context.optimisticQueryKey,
            context.previous,
          );
        }

        return handleMutationError(error);
      },
      onMutate: options?.onMutate,
    },
  );
};
