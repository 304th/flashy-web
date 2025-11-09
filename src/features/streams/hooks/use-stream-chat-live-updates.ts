import { useEffect } from "react";
import { channel } from "@/lib/query-toolkit-v2";
import { streamChatMessagesWebSocket } from "@/features/streams/services/stream-chat-messages-websocket";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";
import {useMe} from "@/features/auth/queries/use-me";

/**
 * Hook to handle live updates for stream chat messages
 * - Listens for new chat messages and adds them to the collection
 * - Listens for deleted chat messages and removes them from the collection
 * - Automatically joins/leaves the stream chat room when the hook mounts/unmounts
 */
export const useStreamChatLiveUpdates = (streamId: string) => {
  const { data: me } = useMe();

  useEffect(() => {
    // Subscribe to connection changes to join room once connected
    const unsubscribeConnection =
      streamChatMessagesWebSocket.onConnectionChange((connected) => {
        if (connected) {
          console.log(`[StreamChat] Connected! Joining stream chat ${streamId}`);
          streamChatMessagesWebSocket.joinStreamChat(streamId);
        }
      });

    // If already connected, join immediately
    if (streamChatMessagesWebSocket.isConnected) {
      streamChatMessagesWebSocket.joinStreamChat(streamId);
    }

    // Subscribe to chat message events
    const unsubscribe = streamChatMessagesWebSocket.subscribe(
      (event, eventName) => {
        // Only process events for this stream
        if (event.streamId !== streamId) {
          return;
        }

        if (event.type === "new_chat_message" && event.message) {
          console.log(
            `[StreamChat] New message received for stream ${streamId}`,
            event.message,
          );

          if (me?.fbId === event.message?.user?.fbId) {
            return;
          }

          // Add the new message to the collection
          void channel(streamChatCollection).prependIfNotExists(event.message, {
            queryKey: ["stream", streamId, "chat", "messages"],
          });
        } else if (event.type === "deleted_chat_message" && event.messageId) {
          console.log(
            `[StreamChat] Message deleted for stream ${streamId}:`,
            event.messageId,
          );

          // Remove the deleted message from the collection
          void channel(streamChatCollection).filter((message) => message._id !== event.messageId);
        }
      },
    );

    return () => {
      // Leave the stream chat room
      streamChatMessagesWebSocket.leaveStreamChat(streamId);
      unsubscribe();
      unsubscribeConnection();
    };
  }, [streamId, me]);

  return {
    isConnected: streamChatMessagesWebSocket.isConnected,
  };
};
