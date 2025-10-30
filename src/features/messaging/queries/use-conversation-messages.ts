import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-message.collection";

export const useConversationMessages = (conversationId?: string) => {
  return usePartitionedQuery<Message, { conversationId?: string }>({
    queryKey: ["conversation", conversationId, "messages"],
    collection: conversationMessagesCollection,
    getParams: ({ pageParam }) => ({ pageParam, conversationId }),
    options: {
      enabled: Boolean(conversationId),
    },
  });
};
