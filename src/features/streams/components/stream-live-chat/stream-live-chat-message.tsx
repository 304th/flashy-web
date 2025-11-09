import { UserProfile } from "@/components/ui/user-profile";
import { useIsStreamHost } from "@/features/streams/hooks/use-is-stream-host";
import { StreamLiveChatMessageMenu } from "@/features/streams/components/stream-live-chat/stream-live-chat-message-menu";

export const StreamLiveChatMessage = ({
  chatMessage,
  stream,
}: {
  chatMessage: ChatMessage;
  stream: Stream;
}) => {
  const isHost = useIsStreamHost(stream);

  return (
    <div
      className={`flex p-4 transition justify-between
        ${isHost ? "bg-amber-900/40" : "hover:bg-base-300"}`}
    >
      <div className="flex w-full gap-2 items-start">
        <UserProfile user={chatMessage.user} withoutUsername />
        <div className="flex flex-col">
          <p className="text-white font-medium text-lg">
            {chatMessage.user.username}
          </p>
          <p>{chatMessage.message}</p>
        </div>
      </div>
      <StreamLiveChatMessageMenu chatMessage={chatMessage} stream={stream} />
    </div>
  );
};
