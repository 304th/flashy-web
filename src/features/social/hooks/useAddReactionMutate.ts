import { useQueryClient } from "@tanstack/react-query";
import { produce} from "immer";
import { useMe } from "@/features/auth/queries/useMe";
import type {AddReactionParams} from "@/features/reactions/queries/useAddReaction";
import { handleOptimisticUpdate } from "@/lib/query";

export const useAddReactionMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient()

  return handleOptimisticUpdate<Paginated<SocialPost[]>, AddReactionParams>(queryClient)({
    queryKey: ['social'],
    mutate: (paginatedSocialPosts, params) => produce(paginatedSocialPosts, (draft) => {
      draft.pages.forEach((page) => {
        page.forEach((post) => {
          if (post._id === params.id) {
            if (!post.reactions || !post.reactions?.like) {
              post.reactions = { like: {} }
            }

            post.reactions.like[me!.fbId] = {
              fbId: me!.fbId,
              username: me!.username,
              userimage: me!.userimage,
            }
          }
        });
      });
    }),
  })
}