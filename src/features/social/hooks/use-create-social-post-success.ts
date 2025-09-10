import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { syncSocialPostsOnSuccess } from "@/features/social/queries/use-social-posts";
import { useMe } from "@/features/auth/queries/use-me";

export const useCreateSocialPostSuccess = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return syncSocialPostsOnSuccess(
    queryClient,
    (paginatedSocialsPosts, newSocialPost) => {
      return produce(paginatedSocialsPosts, (draft) => {
        const old = draft.pages[0][0]; //TODO: to prevent from images disappearing and reappearing

        draft.pages[0][0] = {
          ...newSocialPost,
          _optimisticId: old._optimisticId,
          images: old.images,
        };
      });
    },
    me?.fbId,
  );
};
