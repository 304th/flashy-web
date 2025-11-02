import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner/spinner";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
import { useIsChatMessageOwned } from "@/features/messaging/hooks/use-is-chat-message-owned";
import { useIsChatUnread } from "@/features/messaging/hooks/use-is-chat-unread";
import { isTimeWithinSeconds, timeAgo } from "@/lib/utils";

export const ConversationPreview = ({
  conversation,
  isActive,
}: {
  conversation: Optimistic<Conversation>;
  isActive: boolean;
}) => {
  const isNew = isTimeWithinSeconds(Number(conversation.createdAt), {
    seconds: 300,
  });
  const isPending = conversation._optimisticStatus === "pending";
  const isError = conversation._optimisticStatus === "error";
  const isLastMessageOwned = useIsChatMessageOwned(conversation.lastMessage);
  const isChatUnread = useIsChatUnread(conversation);

  return (
    <Link
      href={`/messages/chat?id=${conversation._id}${conversation._optimisticId ? "&new=true" : ""}`}
    >
      <div
        className={`flex w-full p-4 justify-between transition cursor-pointer
          ${isError ? "bg-red-400/20" : isNew || isChatUnread ? "bg-blue-500/20" : isActive ? "bg-base-400" : "hover:bg-base-300"}`}
      >
        <div className="flex items-center gap-3">
          <ConversationThumbnail conversation={conversation} />
          <div className="flex flex-col">
            <ConversationTitle conversation={conversation} />
            <p className="text-sm ellipsis max-w-[250px]">
              {isLastMessageOwned ? (
                <>
                  <span className="text-orange-500">You: </span>
                  {conversation.lastMessage?.body}
                </>
              ) : (
                (conversation.lastMessage?.body ?? "No messages")
              )}
            </p>
          </div>
        </div>
        <div className="">
          {isPending ? (
            <Spinner />
          ) : isError ? (
            <TriangleAlertIcon size={16} className="text-red-500" />
          ) : (
            <p className="text-xs">
              {isNew ? "Now" : timeAgo(conversation.updatedAt, false)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
