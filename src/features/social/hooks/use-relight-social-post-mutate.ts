import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
import { useMe } from "@/features/auth/queries/use-me";
import { RelightSocialPostParams } from "@/features/social/queries/use-relight-social-post";

export const useRelightSocialPostMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return optimisticUpdateSocialPosts<RelightSocialPostParams>(
    queryClient,
    (paginatedSocialsPosts, params) => {
      return produce(paginatedSocialsPosts, (draft) => {
        draft.pages.forEach((page) => {
          page.forEach((post) => {
            post.relitsCount += params.isRelighted ? 1 : -1;

            if (params.isRelighted) {
              post.relits[me!.fbId] = true;
            } else {
              delete post.relits?.[me!.fbId];
            }
          });
        });
      });
    },
    me?.fbId,
  );
};
