import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";

const PAGE_LIMIT = 50;

export const useConversationMessages = (conversationId?: string) => {
  return usePartitionedQuery<
    Message,
    { conversationId?: string; offset: number; limit: number }
  >({
    queryKey: ["conversation", conversationId, "messages"],
    collection: conversationMessagesCollection,
    // getParams: ({ pageParam }) => ({ pageParam, conversationId }),
    getParams: ({ pageParam }) =>
      ({
        conversationId,
        offset: (pageParam - 1) * PAGE_LIMIT,
        limit: PAGE_LIMIT,
      }) as any,
    options: {
      enabled: Boolean(conversationId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
};
