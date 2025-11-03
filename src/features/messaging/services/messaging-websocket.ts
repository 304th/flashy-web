import config from "@/config";
import { firebaseAuth } from "@/services/firebase";

type MessageHandler = (message: Message) => void;
type ConnectionHandler = (connected: boolean) => void;

class MessagingWebSocketService {
  private ws: WebSocket | null = null;
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
        if (user && this.shouldConnect) {
          this.connect();
        } else {
          this.disconnect();
        }
      });
    }
  }

  subscribe(handler: MessageHandler) {
    this.messageHandlers.add(handler);
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

  private getWebSocketUrl(): string | null {
    const baseUrl = config.api.baseUrl;
    if (!baseUrl) return null;

    // Convert HTTP(S) URL to WebSocket URL
    const wsUrl = baseUrl.replace(/^http/, "ws");
    // Add path for messages WebSocket endpoint
    return `${wsUrl}/messages/ws`;
  }

  private async connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = this.getWebSocketUrl();
    if (!wsUrl) {
      console.warn("WebSocket URL not configured");
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
      // Try connecting with token in URL query string
      let url = `${wsUrl}?token=${encodeURIComponent(token)}`;

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionHandlers(true);
        console.log("WebSocket connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_message" && data.message) {
            this.notifyMessageHandlers(data.message as Message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.notifyConnectionHandlers(false);
        console.log("WebSocket disconnected");

        // Attempt to reconnect if we should be connected
        if (this.shouldConnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.reconnectTimeout = setTimeout(() => {
            this.connect();
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error("Error connecting WebSocket:", error);
      this.isConnecting = false;
      this.notifyConnectionHandlers(false);
    }
  }

  private ensureConnected() {
    if (this.shouldConnect || this.isConnecting) {
      return;
    }

    const user = firebaseAuth.currentUser;
    if (user) {
      this.connect();
    }
  }

  private disconnect() {
    this.shouldConnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyConnectionHandlers(false);
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const messagingWebSocket = new MessagingWebSocketService();
