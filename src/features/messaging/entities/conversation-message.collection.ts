import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { messageSchema } from "@/features/messaging/schemas/message.schema";

export const conversationMessagesCollection = createCollection<
  Message,
  { pageParam?: number; conversationId?: string }
>({
  async sourceFrom(params) {
    const response = await api
      .get(`conversations/${params.conversationId}/messages?offset=0&limit=50`)
      .json<{ data: Message[] }>();

    return response.data;
  },
  schema: messageSchema,
  name: "conversations",
});
