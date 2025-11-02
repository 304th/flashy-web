import { createCollection, useLiveQuery } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useAuthed } from "@/features/auth/hooks/use-authed";
import { conversationSchema } from "@/features/messaging/schemas/conversation.schema";

export const profileUnreadConversationsCollection =
  createCollection<Conversation>({
    sourceFrom: async () => {
      const response = await api
        .get(`unread-conversations`)
        .json<{ data: Conversation[] }>();

      return response.data;
    },
    schema: conversationSchema,
    name: "profileUnreadConversations",
  });

export const useProfileUnreadConversations = () => {
  const authed = useAuthed();

  return useLiveQuery<Conversation, never>({
    queryKey: ["me", authed.user?.uid, "unread", "conversations"],
    collection: profileUnreadConversationsCollection,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
