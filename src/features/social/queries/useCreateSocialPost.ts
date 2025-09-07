import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";

export interface CreateSocialPostParams {
  description?: string;
  poll?: string[];
}

export const useCreateSocialPost = (options?: {
  onMutate?: (variables: CreateSocialPostParams) => unknown;
}) => {
  const queryClient = useQueryClient();

  return getMutation(
    ["createSocialPost"],
    async (params: CreateSocialPostParams) => {
      const formData = new FormData();

      if (params.description) {
        formData.append("description", params.description);
      }

      if (params.poll && params.poll.length > 0) {
        formData.append(
          "poll", //FIXME: WHAT???
          JSON.stringify(
            params.poll.map((item: any, index: number) => ({
              id: index + 1,
              text: item,
              votes: [],
            })),
          ),
        );
      }

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
