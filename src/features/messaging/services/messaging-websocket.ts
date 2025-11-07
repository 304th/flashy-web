import { WebSocketService } from "@/lib/websocket/websocket-service";

class MessagingWebSocketService extends WebSocketService<Message> {
  constructor() {
    super({
      namespace: "/messages",
      eventName: "new_message",
      payloadExtractor: (payload: { type?: string; message?: Message }) =>
        payload?.message || null,
      serviceName: "Messaging",
    });
  }
}

// Singleton instance
export const messagingWebSocket = new MessagingWebSocketService();
