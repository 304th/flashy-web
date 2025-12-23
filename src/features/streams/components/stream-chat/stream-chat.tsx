import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { streamChatCollection } from "@/features/streams/entities/stream-chat.collection";
import { useSendChatMessage } from "@/features/streams/mutations/use-send-chat-message";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StreamChatProps {
  streamId: string;
  enabled?: boolean;
}

export const StreamChat = ({ streamId, enabled = true }: StreamChatProps) => {
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sendMessage = useSendChatMessage();

  const { data: messages, query } = usePartitionedQuery({
    collection: streamChatCollection,
    queryKey: ["stream", streamId, "chat"],
    getParams: ({ pageParam }: any) => ({ streamId, pageParam }),
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Refetch messages every 3 seconds for real-time updates
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      query.refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [enabled, query]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !enabled) return;

    try {
      await sendMessage.mutateAsync({
        streamId,
        message: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!enabled) {
    return (
      <div
        className="flex h-full items-center justify-center
          text-muted-foreground"
      >
        Chat is disabled for this stream
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-3 p-4"
      >
        {query.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading chat...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className="flex gap-3">
              <UserAvatar avatar={msg.user.userimage} className="h-8 w-8" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">
                    {msg.user.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm break-words">{msg.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              No messages yet. Be the first to chat!
            </p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message..."
            disabled={sendMessage.isPending}
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || sendMessage.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
