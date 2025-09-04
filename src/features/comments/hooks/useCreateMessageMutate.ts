import { useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useMe } from "@/features/auth/queries/useMe";
import { updateQueryData } from "@/features/comments/queries/useComments";
import type { CreateCommentParams } from "@/features/comments/queries/useCreateComment";

export const useCreateMessageMutate = () => {
  const [me] = useMe();
  const queryClient = useQueryClient();

  return updateQueryData<Paginated<CommentReply[]>, CreateCommentParams>(
    queryClient,
    (paginatedComments, params) => {
      return produce(paginatedComments, (draft) => {
        draft.pages[0].unshift({
          _id: params.message,
          text: params.message,
          repliesCount: 0,
          likesCount: 0,
          item_key: params.message,
          item_type: params.postType,
          created_by: {
            _id: me!.fbId,
            username: me!.username,
            userimage: me!.userimage,
          },
          created_at: "1",
          isLiked: false,
        });
      });
    },
  );
};
