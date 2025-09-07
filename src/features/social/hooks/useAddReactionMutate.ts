import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useMe } from "@/features/auth/queries/use-me";
import type { AddReactionParams } from "@/features/reactions/queries/useAddReaction";
import { updateQueryData } from "@/features/social/queries/useSocialPosts";

export const useAddReactionMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return updateQueryData<AddReactionParams>(
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
  );
};
