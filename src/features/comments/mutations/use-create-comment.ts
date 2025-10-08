import { api } from "@/services/api";
import { useOptimisticMutation, createMutation } from "@/lib/query-toolkit-v2";
import { commentsCollection } from "@/features/comments/collections/comments";
import { socialFeedCollection } from "@/features/social/collections/social-feed";
import {timeout} from "@/lib/utils";

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
  return useOptimisticMutation({
    mutation: createComment,
    onOptimistic: (ch, params) => {
      return Promise.all([
        ch(commentsCollection).prepend(params, { sync: true }),
        ch(socialFeedCollection).update(params.postId, (post) => {
          post.commentsCount += 1;
        }),
      ]);
    },
  });
};
