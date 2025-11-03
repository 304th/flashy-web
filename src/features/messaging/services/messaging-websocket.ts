import config from "@/config";
import { firebaseAuth } from "@/services/firebase";
import { io, type Socket } from "socket.io-client";

type MessageHandler = (message: Message) => void;
type ConnectionHandler = (connected: boolean) => void;

class MessagingWebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private isConnecting = false;
  private shouldConnect = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Listen to auth state changes
      firebaseAuth.onAuthStateChanged((user) => {
        if (user && this.messageHandlers.size > 0) {
          this.connect();
        } else {
          this.disconnect();
        }
      });
    }
  }

  subscribe(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    // Mark that we should maintain a connection while there are subscribers
    this.shouldConnect = true;
    this.ensureConnected();

    return () => {
      this.messageHandlers.delete(handler);

      if (this.messageHandlers.size === 0) {
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

  private notifyMessageHandlers(message: Message) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyConnectionHandlers(connected: boolean) {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }

  private getSocketConfig(): { baseUrl: string; path: string; namespace: string } | null {
    const baseUrl = new URL(config.api.baseUrl!);

    if (!baseUrl) {
      return null;
    }

    return { baseUrl: baseUrl.origin, path: "/api/v1/socket.io", namespace: "/messages" };
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
        console.log("Socket.IO connected");
      });

      this.socket.on("new_message", (payload: { type?: string; message?: Message }) => {
        if (payload?.message) {
          this.notifyMessageHandlers(payload.message);
        }
      });

      this.socket.on("connect_error", (error: any) => {
        console.error("Socket.IO connect_error:", error);
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
      });

      this.socket.on("disconnect", () => {
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
        console.log("Socket.IO disconnected");

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
      console.error("Error connecting Socket.IO:", error);
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
export const messagingWebSocket = new MessagingWebSocketService();
