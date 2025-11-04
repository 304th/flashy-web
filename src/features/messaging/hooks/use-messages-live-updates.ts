import { useEffect } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { profileConversationsCollection } from "@/features/profile/entities/profile-conversations.collection";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";
import { messagingWebSocket } from "@/features/messaging/services/messaging-websocket";

/**
 * Hook to handle live updates for messages in a conversation
 * When a new message arrives via WebSocket, it's added to the conversation messages
 */
export const useMessagesLiveUpdates = () => {
  useEffect(() => {
    return messagingWebSocket.subscribe((message) => {
      void channel(profileConversationsCollection).update(
        message.conversationId,
        (conversation) => {
          conversation.lastMessage = message;
          conversation.updatedAt = message.createdAt;
          conversation.readBy = [];
        },
      );
      void channel(conversationMessagesCollection).prepend(message, {
        queryKey: ["conversation", message.conversationId, "messages"],
      });
    });
  }, []);

  return {
    isConnected: messagingWebSocket.isConnected,
  };
};
