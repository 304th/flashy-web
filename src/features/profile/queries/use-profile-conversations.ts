import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { conversationsCollection } from "@/features/messaging/entities/conversations.collection";

export const useProfileConversations = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<Conversation, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "conversations"],
    collection: conversationsCollection,
    getParams: ({ pageParam }) => ({ pageParam }) as any,
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
