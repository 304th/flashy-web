import { UserAvatar } from "@/components/ui/user-avatar";
import { useConversationPreviewUser } from "@/features/messaging/hooks/use-conversation-preview-user";
import { timeAgo } from "@/lib/utils";

export const ConversationPreview = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const latestUser = useConversationPreviewUser(conversation);

  return (
    <div
      className="flex w-full p-4 justify-between transition hover:bg-base-300
        cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <UserAvatar avatar={latestUser?.userimage} className={"size-12"} />
        <div className="flex flex-col">
          <p className="text-white text-lg font-medium">
            {latestUser?.username}
          </p>
          <p className="text-sm">
            {conversation.lastMessage?.body ?? "No messages"}
          </p>
        </div>
      </div>
      <div className="">
        <p className="text-xs">{timeAgo(conversation.updatedAt, false)}</p>
      </div>
    </div>
  );
};
