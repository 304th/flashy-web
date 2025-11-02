import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { useMe } from "@/features/auth/queries/use-me";
import { profileConversationsCollection } from "@/features/profile/entities/profile-conversations.collection";

export const useProfileConversations = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<Conversation, { pageParam: number }>({
    queryKey: ["me", me?.fbId, "conversations"],
    collection: profileConversationsCollection,
    getParams: ({ pageParam }) => ({ pageParam }) as any,
    options: {
      enabled: Boolean(me?.fbId),
    },
  });
};
