import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/features/auth/queries/use-me";
import { optimisticUpdateSocialPosts } from "@/features/social/queries/use-social-posts";
import { updateQueryData as updateSocialPostByIdQuery } from "@/features/social/queries/use-social-post-by-id";
import type { CreateCommentParams } from "@/features/comments/queries/use-create-comment";

export const useUpdateCountOnCommentCreate = (id: string) => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return [
    optimisticUpdateSocialPosts<CreateCommentParams>(
      queryClient,
      (state) => {
        return produce(state, (draft) => {
          draft.pages.forEach((page) => {
            page.forEach((post) => {
              if (post._id === id) {
                post.commentsCount += 1;
              }
            });
          });
        });
      },
      me?.fbId,
    ),
    updateSocialPostByIdQuery<CreateCommentParams>(
      queryClient,
      (state) => {
        return produce(state, (draft) => {
          draft.commentsCount += 1;
        });
      },
      id,
    ),
  ];
};
