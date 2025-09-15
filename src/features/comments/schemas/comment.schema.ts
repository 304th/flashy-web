import { nanoid } from "nanoid";

class CommentSchema implements StaticSchema<CommentPost> {
  getId(): keyof CommentPost {
    return "_id";
  }

  createEntityFromParams(params: Partial<CommentPost>): CommentPost {
    const id = nanoid();

    return {
      _id: id,
      text: "",
      repliesCount: 0,
      likesCount: 0,
      item_key: "",
      item_type: "",
      created_by: {
        _id: "",
        username: "",
        userimage: "",
      },
      mentionedUsers: [],
      created_at: new Date().toISOString(),
      isLiked: false,
      ...params,
    };
  }
}

export const commentSchema = new CommentSchema();
