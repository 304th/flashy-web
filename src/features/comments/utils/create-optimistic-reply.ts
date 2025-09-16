import { nanoid } from "nanoid";
import { CreateReplyParams } from "@/features/comments/mutations/use-create-reply";

export const createOptimisticReply = (
  params: CreateReplyParams,
  author: Author,
): Optimistic<Reply> => ({
  _optimisticId: nanoid(),
  _optimisticStatus: "pending",
  _id: nanoid(),
  text: params.message,
  likesCount: 0,
  item_key: params.message,
  item_type: "post",
  created_by: {
    _id: author.fbId,
    username: author.username,
    userimage: author.userimage,
  },
  mentionedUsers: params.mentionedUsers,
  created_at: new Date().toISOString(),
  isLiked: false,
});
