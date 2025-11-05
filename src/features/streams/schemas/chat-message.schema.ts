import { nanoid } from "nanoid";

class ChatMessageSchema implements StaticSchema<ChatMessage> {
  getId(): keyof ChatMessage {
    return "_id";
  }

  createEntityFromParams(params: Partial<ChatMessage>): ChatMessage {
    const id = nanoid();

    return {
      _id: id,
      streamId: "",
      user: {
        fbId: "",
        username: "",
        userimage: "",
      },
      message: "",
      createdAt: new Date().toISOString(),
      ...params,
    };
  }
}

export const chatMessageSchema = new ChatMessageSchema();
