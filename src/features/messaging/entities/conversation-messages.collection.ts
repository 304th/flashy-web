import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { messageSchema } from "@/features/messaging/schemas/message.schema";

export const conversationMessagesCollection = createCollection<
  Message,
  { conversationId?: string; offset: number; limit: number }
>({
  async sourceFrom(params) {
    const response = await api
      .get(
        `conversations/${params.conversationId}/messages?offset=${params.offset}&limit=${params.limit}`,
      )
      .json<{ data: Message[] }>();

    return response.data;
  },
  schema: messageSchema,
  name: "conversationsMessages",
});
