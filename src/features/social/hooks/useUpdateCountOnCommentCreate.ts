import { produce } from "immer";
import { useQueryClient } from "@tanstack/react-query";
import { updateQueryData as updateSocialPostsQuery } from "@/features/social/queries/useSocialPosts";
import { updateQueryData as updateSocialPostByIdQuery } from "@/features/social/queries/useSocialPostById";
import type { CreateCommentParams } from "@/features/comments/queries/useCreateComment";

export const useUpdateCountOnCommentCreate = (id: string) => {
  const queryClient = useQueryClient();

  return [
    updateSocialPostsQuery<CreateCommentParams>(queryClient, (state) => {
      return produce(state, (draft) => {
        draft.pages.forEach((page) => {
          page.forEach((post) => {
            if (post._id === id) {
              post.commentsCount += 1;
            }
          });
        });
      });
    }),
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
