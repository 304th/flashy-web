import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { conversationMessagesWithUserCollection } from "@/features/messaging/entities/conversation-messages-with-user.collection";

export const useConversationMessagesWithUser = (userId?: string) => {
  return usePartitionedQuery<Message, { userId: string; pageParam: number }>({
    queryKey: ["conversation", "user", userId, "messages"],
    collection: conversationMessagesWithUserCollection,
    getParams: ({ pageParam }) => ({ pageParam, userId: userId! }),
    options: {
      enabled: Boolean(userId),
    },
  });
};
