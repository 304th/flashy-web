import { useQueryClient } from "@tanstack/react-query";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";
import { api } from "@/services/api";

export interface CreateCommentParams {
  postId: string;
  postType: string;
  message: string;
  mentionedUsers: string[];
}

//FIXME: refactor on backend
export const useCreateComment = (options?: {
  onMutate?: (variables: CreateCommentParams) => unknown;
  onSuccess?: (newPost: CommentPost) => void;
}) => {
  const queryClient = useQueryClient();

  return getMutation<CommentPost, Error, CreateCommentParams>(
    ["createComment"],
    async (params: CreateCommentParams) => {
      const data = await api
        .post("comment", {
          json: {
            itemMongoKey: params.postId,
            itemType: params.postType,
            mentionedUsers: params.mentionedUsers,
            commentFormKey: `reply_first_${params.postId}`,
            comment: { text: params.message },
          },
        })
        .json<{ response: CommentPost }>();

      return data.response;
    },
    {
      onMutate: options?.onMutate,
      onSuccess: options?.onSuccess,
      onError: handleOptimisticUpdateError(queryClient),
    },
  );
};
