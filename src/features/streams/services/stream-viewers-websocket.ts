import { WebSocketServiceOptionalAuth } from "@/lib/websocket/websocket-service-optional-auth";

export interface StreamViewerCountEvent {
  type: "viewer_count_update";
  streamId: string;
  viewers: number;
}

class StreamViewersWebSocketService extends WebSocketServiceOptionalAuth<StreamViewerCountEvent> {
  constructor() {
    super({
      namespace: "/stream-viewers",
      events: [
        {
          eventName: "viewer_count_update",
          payloadExtractor: (payload: {
            type?: string;
            streamId?: string;
            viewers?: number;
          }) => {
            if (
              payload?.streamId !== undefined &&
              payload?.viewers !== undefined
            ) {
              return {
                type: "viewer_count_update" as const,
                streamId: payload.streamId,
                viewers: payload.viewers,
              };
            }
            return null;
          },
        },
      ],
      serviceName: "StreamViewers",
      requireAuth: false, // Allow anonymous users to view streams
    });
  }

  /**
   * Join a stream as a viewer
   */
  joinStream(streamId: string) {
    this.emit("join_stream", {
      streamId,
      visitorId: localStorage.getItem("visitorId"),
    });
  }

  /**
   * Leave a stream as a viewer
   */
  leaveStream(streamId: string) {
    this.emit("leave_stream", {
      streamId,
      visitorId: localStorage.getItem("visitorId"),
    });
  }
}

// Singleton instance
export const streamViewersWebSocket = new StreamViewersWebSocketService();
