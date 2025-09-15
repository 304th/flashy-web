import { nanoid } from "nanoid";

class ReplySchema implements StaticSchema<Reply> {
  getId(): keyof Reply {
    return "_id";
  }

  createEntityFromParams(params: Partial<Reply>): Reply {
    const id = nanoid();

    return {
      _id: id,
      text: "",
      likesCount: 0,
      item_key: "",
      item_type: "post",
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

export const replySchema = new ReplySchema();
