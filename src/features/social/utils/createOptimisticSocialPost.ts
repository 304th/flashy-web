import { nanoid } from "nanoid";
import { CreateSocialPostParams } from "@/features/social/queries/useCreateSocialPost";

export const createOptimisticSocialPost = (
  params: CreateSocialPostParams,
  author: Author,
): SocialPost => ({
  _id: nanoid(),
  description: params.description,
  image: "",
  poll: [],
  reactions: {},
  likesCount: 0,
  commentsCount: 0,
  relitsCount: 0,
  mentionedUsers: [],
  pinned: false,
  userId: author.fbId,
  username: author.username,
  userimage: author.userimage,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
