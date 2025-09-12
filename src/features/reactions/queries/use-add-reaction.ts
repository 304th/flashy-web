import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";

export interface AddReactionParams {
  id: string;
  postType: PostType;
  reactionType: ReactionType;
  count?: number;
}

export const useAddReaction = (options?: {
  onMutate?: (variables: AddReactionParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["addReaction"],
    async ({ id, postType, reactionType, count = 1 }: AddReactionParams) => {
      return await api
        .post("reactions/addReaction", {
          json: {
            postId: id,
            postType: postType,
            reactionType: reactionType,
            count: count,
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
