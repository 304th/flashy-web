import { nanoid } from "nanoid";
import { CreateCommentParams } from "@/features/comments/queries/useCreateComment";

export const createOptimisticComment = (params: CreateCommentParams, author: Author) => ({
  _id: nanoid(),
  text: params.message,
  repliesCount: 0,
  likesCount: 0,
  item_key: params.message,
  item_type: params.postType,
  created_by: {
    _id: author.fbId,
    username: author.username,
    userimage: author.userimage,
  },
  created_at: new Date().toISOString(),
  isLiked: false,
});