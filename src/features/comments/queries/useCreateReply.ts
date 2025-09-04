import { getMutation } from "@/lib/query";
import { api } from "@/services/api";

interface CreateReplyParams {
  commentId: string;
  mentionedUsers: string[];
  message: string;
}

export const useCreateReply = () =>
  getMutation(["createReply"], async (params: CreateReplyParams) => {
    return api
      .post("reply", {
        json: {
          mentionedUsers: params.mentionedUsers,
          reply: {
            parentCommentId: params.commentId,
            text: params.message,
          },
        },
      })
      .json();
  });
