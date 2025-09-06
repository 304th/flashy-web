import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";

export interface AddLikeParams {
  id: string;
  isLiked: boolean;
}

export const useAddLike = (options?: {
  onMutate?: (variables: AddLikeParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["like"],
    async (params: AddLikeParams) => {
      return api
        .post("comment/like", {
          json: {
            _id: params.id,
            isLiked: params.isLiked,
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
