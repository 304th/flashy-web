import config from "@/config";
import { firebaseAuth } from "@/services/firebase";
import { io, type Socket } from "socket.io-client";

type StreamHandler = (stream: Stream) => void;
type ConnectionHandler = (connected: boolean) => void;

class StreamsWebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private streamHandlers = new Set<StreamHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private isConnecting = false;
  private shouldConnect = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Listen to auth state changes
      firebaseAuth.onAuthStateChanged((user) => {
        if (user && this.streamHandlers.size > 0) {
          this.connect();
        } else {
          this.disconnect();
        }
      });
    }
  }

  subscribe(handler: StreamHandler) {
    this.streamHandlers.add(handler);
    // Mark that we should maintain a connection while there are subscribers
    this.shouldConnect = true;
    this.ensureConnected();

    return () => {
      this.streamHandlers.delete(handler);

      if (this.streamHandlers.size === 0) {
        this.disconnect();
      }
    };
  }

  onConnectionChange(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  private notifyStreamHandlers(stream: Stream) {
    this.streamHandlers.forEach((handler) => handler(stream));
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  private getSocketConfig(): {
    baseUrl: string;
    path: string;
    namespace: string;
  } | null {
    const baseUrl = new URL(config.api.baseUrl!);

    if (!baseUrl) {
      return null;
    }

    return {
      baseUrl: baseUrl.origin,
      path: "/api/v1/socket.io",
      namespace: "/streams",
    };
  }

  private async connect() {
    if (this.isConnecting || this.socket?.connected) {
      return;
    }

    const cfg = this.getSocketConfig();

    if (!cfg) {
      console.warn("Socket URL not configured");
      this.isConnecting = false;
      return;
    }

    this.isConnecting = true;
    this.shouldConnect = true;

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        this.isConnecting = false;
        return;
      }

      const token = await user.getIdToken();
      const { baseUrl, path, namespace } = cfg;

      this.socket = io(`${baseUrl}${namespace}`, {
        path,
        transports: ["websocket"],
        auth: { token },
        forceNew: true,
      });

      this.socket.on("connect", () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        console.log("Streams Socket.IO connected");
      });

      this.socket.on(
        "stream_update",
        (payload: { type?: string; stream?: Stream }) => {
          if (payload?.stream) {
            this.notifyStreamHandlers(payload.stream);
          }
        },
      );

      this.socket.on("connect_error", (error: any) => {
        console.error("Streams Socket.IO connect_error:", error);
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
      });

      this.socket.on("disconnect", () => {
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
        console.log("Streams Socket.IO disconnected");

        // Attempt to reconnect if we should be connected
        if (
          this.shouldConnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          this.reconnectTimeout = setTimeout(() => {
            this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      });
    } catch (error) {
      console.error("Error connecting Streams Socket.IO:", error);
      this.isConnecting = false;
      this.notifyConnectionHandlers(false);
    }
  }

  private ensureConnected() {
    // If already connecting or connected, do nothing
    if (this.isConnecting || this.socket?.connected) return;

    // Mark desire to stay connected while there are subscribers
    this.shouldConnect = true;

    const user = firebaseAuth.currentUser;
    if (user) void this.connect();
  }

  private disconnect() {
    this.shouldConnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.notifyConnectionHandlers(false);
  }

  get isConnected() {
    return !!this.socket?.connected;
  }
}

// Singleton instance
export const streamsWebSocket = new StreamsWebSocketService();
