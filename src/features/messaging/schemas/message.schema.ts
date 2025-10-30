import { nanoid } from "nanoid";

class MessageSchema implements StaticSchema<Message> {
  getId(): keyof Message {
    return "_id";
  }

  createEntityFromParams(params: Partial<Conversation>): Message {
    const id = nanoid();

    return {
      _id: id,
      conversationId: "",
      author: "" as any,
      body: "",
      attachmentURL: "",
      tipAmount: 0,
      mentionedUsers: [],
      deletedBy: [],
      replyToMessage: "",
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      ...params,
    };
  }
}

export const messageSchema = new MessageSchema();
