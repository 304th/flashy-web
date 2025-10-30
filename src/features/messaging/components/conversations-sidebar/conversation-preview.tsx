import Link from "next/link";
import {ConversationTitle} from "@/features/messaging/components/conversation-title/conversation-title";
import {ConversationThumbnail} from "@/features/messaging/components/conversation-thumbnail/conversation-thumbnail";
import { timeAgo } from "@/lib/utils";

export const ConversationPreview = ({
  conversation,
  isActive,
}: {
  conversation: Conversation;
  isActive: boolean;
}) => {
  return (
    <Link href={`/messages/chat?id=${conversation._id}`}>
      <div
        className={`flex w-full p-4 justify-between transition
        cursor-pointer ${isActive ? "bg-base-400" : "hover:bg-base-300"}`}
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
          <p className="text-xs">{timeAgo(conversation.updatedAt, false)}</p>
        </div>
      </div>
    </Link>
  );
};
