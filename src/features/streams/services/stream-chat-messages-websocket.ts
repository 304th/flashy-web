import { WebSocketServiceOptionalAuth } from "@/lib/websocket/websocket-service-optional-auth";

export interface StreamChatMessageEvent {
  type: "new_chat_message" | "deleted_chat_message";
  streamId: string;
  message?: ChatMessage;
  messageId?: string;
}

class StreamChatMessagesWebSocketService extends WebSocketServiceOptionalAuth<StreamChatMessageEvent> {
  constructor() {
    super({
      namespace: "/stream-chat-messages",
      events: [
        {
          eventName: "new_chat_message",
          payloadExtractor: (payload: {
            type?: string;
            streamId?: string;
            message?: ChatMessage;
          }) => {
            if (payload?.streamId && payload?.message) {
              return {
                type: "new_chat_message" as const,
                streamId: payload.streamId,
                message: payload.message,
              };
            }
            return null;
          },
        },
        {
          eventName: "deleted_chat_message",
          payloadExtractor: (payload: {
            type?: string;
            streamId?: string;
            messageId?: string;
          }) => {
            if (payload?.streamId && payload?.messageId) {
              return {
                type: "deleted_chat_message" as const,
                streamId: payload.streamId,
                messageId: payload.messageId,
              };
            }
            return null;
          },
        },
      ],
      serviceName: "StreamChatMessages",
      requireAuth: false, // Allow anonymous users to view chat
    });
  }

  /**
   * Join a specific stream's chat room
   */
  joinStreamChat(streamId: string) {
    this.emit("join_stream_chat", { streamId });
  }

  /**
   * Leave a specific stream's chat room
   */
  leaveStreamChat(streamId: string) {
    this.emit("leave_stream_chat", { streamId });
  }
}

// Singleton instance
export const streamChatMessagesWebSocket =
  new StreamChatMessagesWebSocketService();
