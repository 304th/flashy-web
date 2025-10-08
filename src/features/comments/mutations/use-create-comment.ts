import { api } from "@/services/api";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { commentsCollection } from "@/features/comments/collections/comments";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import { useMe } from "@/features/auth/queries/use-me";

export interface CreateCommentParams {
  postId: string;
  postType: string;
  text: string;
  mentionedUsers: string[];
}

const createComment = createMutation({
  write: async (params: CreateCommentParams) => {
    const data = await api
      .post("comment", {
        json: {
          itemMongoKey: params.postId,
          itemType: params.postType,
          mentionedUsers: params.mentionedUsers,
          commentFormKey: `reply_first_${params.postId}`,
          comment: { text: params.text },
        },
      })
      .json<{ response: CommentPost }>();

    return data.response;
  },
});

export const useCreateComment = () => {
  const { data: author } = useMe();

  return useOptimisticMutation({
    mutation: createComment,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(commentsCollection).prepend({
          ...params,
          created_by: {
            _id: author!.fbId,
            username: author!.username,
            userimage: author!.userimage,
          },
        }, { sync: true }),
        ch(socialFeedCollection).update(params.postId, (post) => {
          post.commentsCount += 1;
        }),
      ]);
    },
  });
};
