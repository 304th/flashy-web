import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { chatMessageSchema } from "@/features/streams/schemas/chat-message.schema";

export interface StreamChatParams {
  streamId: string;
  limit?: number;
  offset?: number;
}

export const streamChatCollection = createCollection<
  ChatMessage,
  StreamChatParams
>({
  async sourceFrom(params) {
    return api
      .get(`streaming/${params.streamId}/chat`, {
        searchParams: {
          limit: params.limit || 50,
          offset: params.offset || 0,
        },
      })
      .json<ChatMessage[]>();
  },
  schema: chatMessageSchema,
  name: "stream-chat",
});
