import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";

export interface CreateReplyParams {
  commentId: string;
  mentionedUsers: string[];
  message: string;
}

export const useCreateReply = (options?: {
  onMutate?: (variables: CreateReplyParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["createReply"],
    async (params: CreateReplyParams) => {
      return;
      return api
        .post("reply", {
          json: {
            mentionedUsers: params.mentionedUsers,
            reply: {
              parentCommentId: params.commentId,
              text: params.message,
            },
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
