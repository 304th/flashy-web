import { UserProfile } from "@/components/ui/user-profile";
import { StreamLiveChatMessageMenu } from "@/features/streams/components/stream-live-chat/stream-live-chat-message-menu";
import { useIsChatMessageByHost } from "@/features/streams/hooks/use-is-chat-message-by-host";

export const StreamLiveChatMessage = ({
  chatMessage,
  stream,
}: {
  chatMessage: ChatMessage;
  stream: Stream;
}) => {
  const isHost = useIsChatMessageByHost(chatMessage, stream);

  return (
    <div
      className={`flex p-4 transition justify-between
        ${isHost ? "bg-amber-900/40" : "hover:bg-base-300"}`}
    >
      <div className="flex w-full gap-2 items-start">
        <UserProfile user={chatMessage.user} withoutUsername />
        <div className="flex flex-col">
          <p
            className={`${isHost ? "text-yellow-400" : "text-white"} font-medium
              text-lg`}
          >
            {chatMessage.user.username}
          </p>
          <p>{chatMessage.message}</p>
        </div>
      </div>
      <StreamLiveChatMessageMenu chatMessage={chatMessage} stream={stream} />
    </div>
  );
};
