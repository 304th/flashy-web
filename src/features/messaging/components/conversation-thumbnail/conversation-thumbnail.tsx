import { useMemo } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMe } from "@/features/auth/queries/use-me";

export const ConversationThumbnail = ({
  conversation,
  className,
}: {
  conversation: Conversation;
  className?: string;
}) => {
  const { data: me } = useMe();
  const isChannel = conversation.type === "channel";

  const thumbnail = useMemo(() => {
    const isGroupChat = conversation.type === "groupChat";

    if (isGroupChat) {
      return (
        conversation.thumbnail ??
        conversation.members.map((user) => user.userimage)[0]
      ); //TODO: add real implementation
    }

    if (isChannel) {
      return (
        conversation.thumbnail ??
        conversation.members.find((user) => user.fbId === conversation.hostID)
          ?.userimage
      );
    }

    return conversation.members.find((user) => user.fbId !== me?.fbId)
      ?.userimage;
  }, [me, conversation]);

  return <UserAvatar avatar={thumbnail} className={`size-10 ${className}`} />;
};
