import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleMutationError } from "@/lib/query";

interface RemoveReactionParams {
  id: string;
  postType: PostType;
  reactionType: string;
}

export const useRemoveReaction = (options?: {
  onMutate?: (variables: RemoveReactionParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["removeReaction"],
    async ({ id, postType, reactionType }: RemoveReactionParams) => {
      return await api
        .delete("reactions/deleteReaction", {
          json: {
            postId: id,
            postType: postType,
            reactionType: reactionType,
          },
        })
        .json();
    },
    {
      onError: (error: any, _, context: any) => {
        //FIXME: refactor
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
