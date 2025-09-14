import { nanoid } from "nanoid";

class SocialPostSchema implements StaticSchema<SocialPost> {
  getId(): string {
    return "_id";
  }

  createEntityFromParams(params: Partial<SocialPost>): SocialPost {
    const id = nanoid();

    return {
      _id: id,
      description: "",
      images: [],
      reactions: {},
      relits: {},
      likesCount: 0,
      commentsCount: 0,
      relitsCount: 0,
      mentionedUsers: [],
      poll: { pollVotedId: null, results: [] },
      pinned: false,
      orderId: id,
      userId: "",
      username: "",
      userimage: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const socialPostSchema = new SocialPostSchema();
