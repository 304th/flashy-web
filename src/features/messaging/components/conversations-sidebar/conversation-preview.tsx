import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner/spinner";
import { ConversationTitle } from "@/features/messaging/components/conversation-title/conversation-title";
import { ConversationThumbnail } from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
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

  console.log("ERROR:", conversation._optimisticError);

  return (
    <Link href={`/messages/chat?id=${conversation._id}`}>
      <div
        className={`flex w-full p-4 justify-between transition cursor-pointer
          ${isError ? "bg-red-400/20" : isNew ? "bg-blue-400/20" : isActive ? "bg-base-400" : "hover:bg-base-300"}`}
      >
        <div className="flex items-center gap-3">
          <ConversationThumbnail conversation={conversation} />
          <div className="flex flex-col">
            <ConversationTitle conversation={conversation} />
            <p className="text-sm">
              {conversation.lastMessage?.body ?? "No messages"}
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
