import { format } from "date-fns";
import { useIsChatMessageOwned } from "@/features/messaging/hooks/use-is-chat-message-owned";
import { useMemo } from "react";

export const ChatMessage = ({ message }: { message: Message }) => {
  const isOwned = useIsChatMessageOwned(message);
  const messageTime = useMemo(
    () => format(message.createdAt, "h:mm a"),
    [message.createdAt],
  );

  return (
    <div className={`flex w-full ${isOwned ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-2/3 gap-1
          ${isOwned ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex w-full p-2 border-2 rounded-2xl text-white
            ${isOwned ? "bg-orange-900 border-orange-500" : ""}`}
        >
          {message.body}
        </div>
        <p className="text-sm">{messageTime}</p>
      </div>
    </div>
  );
};
