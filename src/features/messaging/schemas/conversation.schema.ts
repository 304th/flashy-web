import { nanoid } from "nanoid";

class ConversationSchema implements StaticSchema<Conversation> {
  getId(): keyof Conversation {
    return "_id";
  }

  createEntityFromParams(params: Partial<Conversation>): Conversation {
    const id = nanoid();

    return {
      _id: id,
      type: "chat",
      channelMode: "",
      thumbnail: "",
      hostID: "",
      members: [],
      lastMessage: null,
      mutedBy: [],
      hideFor: [],
      readBy: [],
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      ...params,
    };
  }
}

export const conversationSchema = new ConversationSchema();
