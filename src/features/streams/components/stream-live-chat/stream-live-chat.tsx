import { StreamLiveChatSendMessage } from "@/features/streams/components/stream-live-chat/stream-live-chat-send-message";
import { StreamLiveChatFeed } from "@/features/streams/components/stream-live-chat/stream-live-chat-feed";
import { useStreamChatLiveUpdates } from "@/features/streams/hooks/use-stream-chat-live-updates";

export const StreamLiveChat = ({ stream }: { stream: Stream }) => {
  // Enable live chat updates via WebSocket
  useStreamChatLiveUpdates(stream._id);

  return (
    <div
      className="flex flex-col justify-between gap-3 rounded-md
        overflow-y-scroll h-[calc(100vh-96px)] bg-base-200"
    >
      <div className="flex flex-col p-4 bg-base-300">
        <p className="text-white font-medium">Chat</p>
      </div>
      <StreamLiveChatFeed stream={stream} />

      <div>
        <StreamLiveChatSendMessage stream={stream} />
      </div>
    </div>
  );
};
