import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useMe } from "@/features/auth/queries/use-me";
import type { AddReactionParams } from "@/features/reactions/queries/use-add-reaction";
import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";

export const useAddReactionMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return optimisticUpdateSocialPosts<AddReactionParams>(
    queryClient,
    (paginatedSocialPosts, params) => {
      return produce(paginatedSocialPosts, (draft) => {
        draft.pages.forEach((page) => {
          page.forEach((post) => {
            if (post._id === params.id) {
              if (!post.reactions || !post.reactions?.like) {
                post.reactions = { like: {} };
              }

              post.reactions.like[me!.fbId] = {
                fbId: me!.fbId,
                username: me!.username,
                userimage: me!.userimage,
              };
            }
          });
        });
      });
    },
    me?.fbId,
  );
};
