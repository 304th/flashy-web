import { useEffect, useRef } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { conversationMessagesCollection } from "@/features/messaging/entities/conversation-messages.collection";
import { messagingWebSocket } from "@/features/messaging/services/messaging-websocket";

/**
 * Hook to handle live updates for messages in a conversation
 * When a new message arrives via WebSocket, it's added to the conversation messages
 */
export const useMessagesLiveUpdates = (conversationId?: string) => {
  const conversationIdRef = useRef<string | undefined>(conversationId);
  const processedMessageIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    return messagingWebSocket.subscribe((message) => {
      // Only process messages for the current conversation
      if (message.conversationId !== conversationIdRef.current) {
        return;
      }

      // Prevent duplicate messages
      if (processedMessageIds.current.has(message._id)) {
        return;
      }

      processedMessageIds.current.add(message._id);

      // Clean up old message IDs to prevent memory leak (keep last 100)
      if (processedMessageIds.current.size > 100) {
        const idsArray = Array.from(processedMessageIds.current);
        processedMessageIds.current = new Set(idsArray.slice(-100));
      }

      // Add the message to the conversation messages collection using Channel
      // Using append since messages are likely ordered oldest-first in the array,
      // and with flex-col-reverse, appending adds to the end of array which appears at bottom visually
      void channel(conversationMessagesCollection).prepend(message, {
        sync: true,
        rollback: false,
      });
    });
  }, [conversationId]);

  return {
    isConnected: messagingWebSocket.isConnected,
  };
};
