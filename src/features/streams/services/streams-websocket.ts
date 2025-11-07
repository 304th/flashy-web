import { WebSocketService } from "@/lib/websocket/websocket-service";

class StreamsWebSocketService extends WebSocketService<Stream> {
  constructor() {
    super({
      namespace: "/streams",
      eventName: "stream_update",
      payloadExtractor: (payload: { type?: string; stream?: Stream }) =>
        payload?.stream || null,
      serviceName: "Streams",
    });
  }
}

// Singleton instance
export const streamsWebSocket = new StreamsWebSocketService();
