import { api } from "@/services/api";
import { createCollection } from "@/lib/query-toolkit-v2";
import { conversationSchema } from "@/features/messaging/schemas/conversation.schema";

export const conversationsCollection = createCollection<
  Conversation,
  { pageParam?: number }
>({
  async sourceFrom() {
    const response = await api
      .get(`conversations?offset=0`)
      .json<{ data: Conversation[] }>();

    return response.data;
  },
  schema: conversationSchema,
  name: "conversations",
});
