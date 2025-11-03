import { useMe } from "@/features/auth/queries/use-me";
import { profileConversationsCollection } from "@/features/profile/entities/profile-conversations.collection";
import { profileUnreadConversationsCollection } from "@/features/profile/queries/use-profile-unread-conversations";
import { channel } from "@/lib/query-toolkit-v2";

export const useMarkUnreadChatsAsRead = (conversationId: string) => {
  const { data: me } = useMe();

  return () => {
    void channel(profileConversationsCollection).update(conversationId, (conversation) => {
      conversation.readBy.push(me!.fbId);
    })
    void channel(profileUnreadConversationsCollection).filter((conversation) => conversation._id !== conversationId)
  }
}