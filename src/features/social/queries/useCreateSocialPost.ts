import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";

export interface CreateSocialPostParams {
  description: string;
}

export const useCreateSocialPost = (options?: {
  onMutate?: (variables: CreateSocialPostParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["createSocialPost"],
    async ({ description }: CreateSocialPostParams) => {
      const formData = new FormData();

      formData.append("description", description);

      await api.post("create-social-post", {
        body: formData,
      });
    },
    {
      onError: handleOptimisticUpdateError(queryClient),
      onMutate: options?.onMutate,
    },
  );
};
