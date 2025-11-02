import Link from 'next/link';
import {ArrowRightIcon} from "lucide-react";
import {UserAvatar} from "@/components/ui/user-avatar";
import { useConversationWithUserExists } from "@/features/messaging/hooks/use-conversation-with-user-exists";

export interface ConversationCreateModalUserProps {
  user: User;
  onStartConversation: () => void;
}

export const ConversationCreateMessageUser = ({
  user,
  onStartConversation,
}: ConversationCreateModalUserProps) => {
  const chatExists = useConversationWithUserExists(user.fbId);

  if (chatExists) {
    return <Link href={`/messages/chat?id=${chatExists._id}`}>
      <MessageUser user={user} />
    </Link>
  }

  return (
    <MessageUser user={user} onStartConversation={onStartConversation} />
  );
};

const MessageUser = ({ user, onStartConversation }: Omit<ConversationCreateModalUserProps, 'onStartConversation'> & { onStartConversation?: () => void }) => {
  return (
    <div
      className="group relative flex items-center justify-between p-2 rounded-md
        cursor-pointer transition hover:bg-base-250 overflow-hidden"
      onClick={onStartConversation}
    >
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar avatar={user?.userimage} className="size-10" />
        <div className="flex flex-col min-w-0">
          <p className="text-white font-medium truncate">{user?.username}</p>
          <p className="text-muted-foreground text-sm truncate">
            @{user?.username}
          </p>
        </div>
      </div>
      <div
        className="opacity-0 transition translate-x-[8px]
          group-hover:opacity-100 group-hover:translate-0
          group-hover:text-white"
      >
        <ArrowRightIcon />
      </div>
    </div>
  );
}