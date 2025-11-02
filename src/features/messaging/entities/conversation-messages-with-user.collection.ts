import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { messageSchema } from "@/features/messaging/schemas/message.schema";

export interface ConversationWithUserParams {
  userId: string;
}

export const conversationMessagesWithUserCollection = createCollection<
  Message,
  { pageParam: number } & ConversationWithUserParams
>({
  async sourceFrom(params) {
    const response = await api
      .get(`conversations/user/${params?.userId}/messages`)
      .json<{ data: Message[] }>();

    return response.data;
  },
  schema: messageSchema,
  name: "conversationMessagesWithUser",
});
