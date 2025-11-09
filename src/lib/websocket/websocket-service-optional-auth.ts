import { io, Socket } from "socket.io-client";
import { firebaseAuth } from "@/services/firebase";
import config from "@/config";

export interface WebSocketConfigOptionalAuth<T> {
  namespace: string;
  events: {
    eventName: string;
    payloadExtractor: (payload: any) => T | null;
  }[];
  serviceName?: string;
  requireAuth?: boolean; // If false, allows anonymous connections
}

type MessageHandler<T> = (message: T, eventName: string) => void;
type ConnectionHandler = (connected: boolean) => void;

/**
 * WebSocket service that supports optional authentication
 * Allows both authenticated and anonymous users to connect
 */
export class WebSocketServiceOptionalAuth<T> {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers = new Set<MessageHandler<T>>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private isConnecting = false;
  private shouldConnect = false;
  private config: WebSocketConfigOptionalAuth<T>;

  constructor(config: WebSocketConfigOptionalAuth<T>) {
    this.config = config;

    if (typeof window !== "undefined") {
      // If auth is required, listen to auth state changes
      if (this.config.requireAuth !== false) {
        firebaseAuth.onAuthStateChanged((user) => {
          if (user && this.messageHandlers.size > 0) {
            this.connect();
          } else {
            this.disconnect();
          }
        });
      }
    }
  }

  subscribe(handler: MessageHandler<T>) {
    console.log(
      `[${this.config.serviceName || "WebSocket"}] Handler subscribed. Total handlers: ${this.messageHandlers.size + 1}`,
    );
    this.messageHandlers.add(handler);
    this.shouldConnect = true;
    this.ensureConnected();

    return () => {
      this.messageHandlers.delete(handler);
      console.log(
        `[${this.config.serviceName || "WebSocket"}] Handler unsubscribed. Total handlers: ${this.messageHandlers.size}`,
      );
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

  private notifyMessageHandlers(message: T, eventName: string) {
    this.messageHandlers.forEach((handler) => handler(message, eventName));
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
    if (!baseUrl) return null;

    return {
      baseUrl: baseUrl.origin,
      path: "/api/v1/socket.io",
      namespace: this.config.namespace,
    };
  }

  private async connect() {
    if (this.isConnecting || this.socket?.connected) return;

    const cfg = this.getSocketConfig();
    if (!cfg) {
      console.warn(
        `[${this.config.serviceName || "WebSocket"}] Socket URL not configured`,
      );
      this.isConnecting = false;
      return;
    }

    this.isConnecting = true;
    this.shouldConnect = true;

    try {
      let token: string | undefined;

      // Only require auth if configured
      if (this.config.requireAuth !== false) {
        const user = firebaseAuth.currentUser;
        if (!user) {
          console.warn(
            `[${this.config.serviceName || "WebSocket"}] No authenticated user`,
          );
          this.isConnecting = false;
          return;
        }
        token = await user.getIdToken();
      } else {
        // Try to get token if user is logged in, but don't require it
        const user = firebaseAuth.currentUser;
        if (user) {
          token = await user.getIdToken();
        }
      }

      const { baseUrl, path, namespace } = cfg;

      const socketOptions: any = {
        path,
        transports: ["websocket"],
        forceNew: true,
      };

      // Only add auth if we have a token
      if (token) {
        socketOptions.auth = { token };
      }

      this.socket = io(`${baseUrl}${namespace}`, socketOptions);

      this.socket.on("connect", () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Socket.IO connected`,
        );
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Listening for events: ${this.config.events.map((e) => `"${e.eventName}"`).join(", ")}`,
        );
      });

      // Catch-all listener to debug what events are actually being received
      this.socket.onAny((eventName, ...args) => {
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Received ANY event: "${eventName}"`,
          args,
        );
      });

      // Listen to all configured events
      this.config.events.forEach((eventConfig) => {
        this.socket!.on(eventConfig.eventName, (payload: any) => {
          console.log(
            `[${this.config.serviceName || "WebSocket"}] Received event "${eventConfig.eventName}"`,
            payload,
          );
          const message = eventConfig.payloadExtractor(payload);
          console.log(
            `[${this.config.serviceName || "WebSocket"}] Extracted message:`,
            message,
          );
          if (message) {
            console.log(
              `[${this.config.serviceName || "WebSocket"}] Notifying ${this.messageHandlers.size} handler(s)`,
            );
            this.notifyMessageHandlers(message, eventConfig.eventName);
          } else {
            console.warn(
              `[${this.config.serviceName || "WebSocket"}] Message extraction returned null`,
            );
          }
        });
      });

      this.socket.on("connect_error", (error: any) => {
        console.error(
          `[${this.config.serviceName || "WebSocket"}] Socket.IO connect_error:`,
          error,
        );
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
      });

      this.socket.on("disconnect", () => {
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Socket.IO disconnected`,
        );

        if (
          this.shouldConnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * this.reconnectAttempts;
          console.log(
            `[${this.config.serviceName || "WebSocket"}] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
          );
          this.reconnectTimeout = setTimeout(() => {
            this.connect();
          }, delay);
        }
      });
    } catch (error) {
      console.error(
        `[${this.config.serviceName || "WebSocket"}] Error connecting Socket.IO:`,
        error,
      );
      this.isConnecting = false;
      this.notifyConnectionHandlers(false);
    }
  }

  private ensureConnected() {
    if (this.isConnecting || this.socket?.connected) return;

    this.shouldConnect = true;

    // If auth is not required, connect immediately
    if (this.config.requireAuth === false) {
      void this.connect();
    } else {
      // Otherwise, wait for auth
      const user = firebaseAuth.currentUser;
      if (user) {
        void this.connect();
      }
    }
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

  /**
   * Emit an event to the server
   */
  emit(eventName: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(eventName, data);
      console.log(
        `[${this.config.serviceName || "WebSocket"}] Emitted event "${eventName}"`,
        data,
      );
    } else {
      console.warn(
        `[${this.config.serviceName || "WebSocket"}] Cannot emit "${eventName}" - socket not connected`,
      );
    }
  }

  get isConnected() {
    return !!this.socket?.connected;
  }
}
