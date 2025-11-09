import { StreamLiveChatSendMessage } from "@/features/streams/components/stream-live-chat/stream-live-chat-send-message";
import { StreamLiveChatFeed } from "@/features/streams/components/stream-live-chat/stream-live-chat-feed";

export const StreamLiveChat = ({ stream }: { stream: Stream }) => {
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
