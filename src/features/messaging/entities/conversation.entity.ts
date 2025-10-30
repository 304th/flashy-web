import {createEntity} from "@/lib/query-toolkit-v2";
import {api} from "@/services/api";

export interface ConversationParams {
  conversationId: string;
}

export const conversationEntity = createEntity<Conversation, ConversationParams>({
  sourceFrom: async (params) => {
    const response = await api.get(`conversations/${params!.conversationId}`).json<{ data: Conversation }>();

    return response.data;
  },
  name: "conversation",
});