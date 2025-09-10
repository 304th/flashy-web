import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
import type { CreateSocialPostParams } from "@/features/social/queries/use-create-social-post";
import { createOptimisticSocialPost } from "@/features/social/utils/createOptimisticSocialPost";
import { useMe } from "@/features/auth/queries/use-me";

export const useCreateSocialPostMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return optimisticUpdateSocialPosts<CreateSocialPostParams>(
    queryClient,
    (paginatedSocialsPosts, params) => {
      return produce(paginatedSocialsPosts, (draft) => {
        draft.pages[0].unshift(createOptimisticSocialPost(params, me!));
      });
    },
    me?.fbId,
  );
};
