import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
import { DeleteSocialPostParams } from "@/features/social/queries/use-delete-social-post";
import { useMe } from "@/features/auth/queries/use-me";

export const useDeleteSocialPostMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return optimisticUpdateSocialPosts<DeleteSocialPostParams>(
    queryClient,
    (paginatedSocialsPosts, params) => {
      return produce(paginatedSocialsPosts, (draft) => {
        draft.pages.forEach((page) => {
          const index = page.findIndex((post) => post._id === params.id);

          if (index !== -1) {
            page.splice(index, 1);
          }
        });
      });
    },
    me?.fbId,
  );
};
