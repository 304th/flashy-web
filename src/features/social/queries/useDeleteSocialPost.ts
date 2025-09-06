import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";

export interface DeleteSocialPostParams {
  id: string;
}

export const useDeleteSocialPost = (options?: {
  onMutate?: (variables: DeleteSocialPostParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["deleteSocialPost"],
    async (params: DeleteSocialPostParams) => {
      api.delete(`social-posts`, {
        json: {
          post_id: params.id,
        },
      });
    },
    {
      onError: handleOptimisticUpdateError(queryClient),
      onMutate: options?.onMutate,
    },
  );
};
