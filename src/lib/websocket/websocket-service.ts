import { io, Socket } from "socket.io-client";
import { firebaseAuth } from "@/services/firebase";
import config from "@/config";

export interface WebSocketConfig<T> {
  namespace: string;
  eventName: string;
  payloadExtractor: (payload: any) => T | null;
  serviceName?: string;
}

type MessageHandler<T> = (message: T) => void;
type ConnectionHandler = (connected: boolean) => void;

export class WebSocketService<T> {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers = new Set<MessageHandler<T>>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private isConnecting = false;
  private shouldConnect = false;
  private config: WebSocketConfig<T>;

  constructor(config: WebSocketConfig<T>) {
    this.config = config;

    if (typeof window !== "undefined") {
      const auth = firebaseAuth();
      auth?.onAuthStateChanged((user) => {
        if (user && this.messageHandlers.size > 0) {
          this.connect();
        } else {
          this.disconnect();
        }
      });
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

  private notifyMessageHandlers(message: T) {
    this.messageHandlers.forEach((handler) => handler(message));
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
      const auth = firebaseAuth();
      const user = auth?.currentUser;
      if (!user) {
        console.warn(
          `[${this.config.serviceName || "WebSocket"}] No authenticated user`,
        );
        this.isConnecting = false;
        return;
      }

      const token = await user.getIdToken();
      const { baseUrl, path, namespace } = cfg;

      this.socket = io(`${baseUrl}${namespace}`, {
        path,
        transports: ["websocket"],
        auth: {
          token,
        },
        forceNew: true,
      });

      this.socket.on("connect", () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Socket.IO connected`,
        );
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Listening for event: "${this.config.eventName}"`,
        );
      });

      // Catch-all listener to debug what events are actually being received
      this.socket.onAny((eventName, ...args) => {
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Received ANY event: "${eventName}"`,
          args,
        );
      });

      this.socket.on(this.config.eventName, (payload: any) => {
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Received event "${this.config.eventName}"`,
          payload,
        );
        const message = this.config.payloadExtractor(payload);
        console.log(
          `[${this.config.serviceName || "WebSocket"}] Extracted message:`,
          message,
        );
        if (message) {
          console.log(
            `[${this.config.serviceName || "WebSocket"}] Notifying ${this.messageHandlers.size} handler(s)`,
          );
          this.notifyMessageHandlers(message);
        } else {
          console.warn(
            `[${this.config.serviceName || "WebSocket"}] Message extraction returned null`,
          );
        }
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

    const user = firebaseAuth()?.currentUser;
    if (user) {
      void this.connect();
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

  get isConnected() {
    return !!this.socket?.connected;
  }
}
