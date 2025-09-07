import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { updateQueryData } from "@/features/social/queries/useSocialPosts";
import type { CreateSocialPostParams } from "@/features/social/queries/useCreateSocialPost";
import { createOptimisticSocialPost } from "@/features/social/utils/createOptimisticSocialPost";
import { useMe } from "@/features/auth/queries/use-me";

export const useCreateSocialPostMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return updateQueryData<CreateSocialPostParams>(
    queryClient,
    (paginatedSocialsPosts, params) => {
      return produce(paginatedSocialsPosts, (draft) => {
        draft.pages[0].unshift(createOptimisticSocialPost(params, me!));
      });
    },
  );
};
