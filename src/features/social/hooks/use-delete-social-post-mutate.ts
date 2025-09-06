import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { updateQueryData } from "@/features/social/queries/useSocialPosts";
import { useMe } from "@/features/auth/queries/useMe";
import { DeleteSocialPostParams } from "@/features/social/queries/useDeleteSocialPost";

export const useDeleteSocialPostMutate = () => {
  const queryClient = useQueryClient();

  return updateQueryData<DeleteSocialPostParams>(
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
  );
};
