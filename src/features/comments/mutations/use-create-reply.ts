import { api } from "@/services/api";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { repliesCollection } from "@/features/comments/collections/replies";
import { commentsCollection } from "@/features/comments/collections/comments";
import { useMe } from "@/features/auth/queries/use-me";

export interface CreateReplyParams {
  commentId: string;
  mentionedUsers: string[];
  text: string;
}

const createReply = createMutation<CreateReplyParams>({
  write: async (params) => {
    const data = await api
      .post("reply", {
        json: {
          mentionedUsers: params.mentionedUsers,
          reply: {
            parentCommentId: params.commentId,
            text: params.text,
          },
        },
      })
      .json<{ response: Reply }>();

    return data.response;
  },
});

export const useCreateReply = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: createReply,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(repliesCollection).prepend(
          {
            ...params,
            created_by: {
              _id: author!.fbId,
              username: author!.username,
              userimage: author!.userimage,
            },
          },
          { sync: true },
        ),
        ch(commentsCollection).update(params.commentId, (comment) => {
          comment.repliesCount += 1;
        }),
      ]);
    },
  });
};
