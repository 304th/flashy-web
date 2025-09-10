import { nanoid } from "nanoid";
import { CreateSocialPostParams } from "@/features/social/queries/use-create-social-post";

export const createOptimisticSocialPost = (
  params: CreateSocialPostParams,
  author: Author,
): Optimistic<SocialPost> => ({
  _optimisticId: nanoid(),
  _optimisticStatus: "pending",
  _id: nanoid(),
  description: params.description || "",
  images: params.images.map((image) => URL.createObjectURL(image)),
  reactions: {},
  relits: {},
  likesCount: 0,
  commentsCount: 0,
  relitsCount: 0,
  mentionedUsers: [],
  poll: { pollVotedId: null, results: [] },
  pinned: false,
  userId: author.fbId,
  username: author.username,
  userimage: author.userimage,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
