import { useQueryClient } from "@tanstack/react-query";
import { getMutation, handleOptimisticUpdateError } from "@/lib/query";
import { api } from "@/services/api";
import { useMe } from "@/features/auth/queries/use-me";

export interface RelightSocialPostParams {
  id: string;
  isRelighted: boolean;
}

export const useRelightSocialPost = (options?: {
  onMutate?: (variables: RelightSocialPostParams) => unknown;
}) => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return getMutation(
    ["relightSocialPost"],
    async (params: RelightSocialPostParams) => {
      return api.post("social-posts/repost", {
        json: {
          _id: params.id,
          username: me!.username,
          isRelited: params.isRelighted,
        },
      });
    },
    {
      onError: handleOptimisticUpdateError(queryClient),
      onMutate: options?.onMutate,
    },
  );
};
