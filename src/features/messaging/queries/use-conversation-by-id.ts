import { useLiveEntity } from "@/lib/query-toolkit-v2";
import {
  conversationEntity,
  ConversationParams,
} from "@/features/messaging/entities/conversation.entity";

export const useConversationById = (conversationId?: string) => {
  return useLiveEntity<Conversation, ConversationParams>({
    queryKey: ["conversation", conversationId],
    entity: conversationEntity,
    getParams: () => ({ conversationId: conversationId! }),
    options: {
      enabled: Boolean(conversationId),
    },
  });
};
