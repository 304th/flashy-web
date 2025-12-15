import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/ui/icons/chat";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
import { useSearchConversationWithUser } from "@/features/messaging/queries/use-search-conversation-with-user";

export const ChannelMessageButton = ({ channel, variant, title }: { channel: User; variant?: string; title?: string }) => {
  const { requireAuth } = useProtectedAction();
  const [conversationWithUser] = useSearchConversationWithUser(channel?.fbId);
  const createConversation = useCreateConversation();

  if (conversationWithUser) {
    return (
      <Link href={`/messages/chat?id=${conversationWithUser._id}`}>
        <MessageButton variant={variant} title={title} />
      </Link>
    );
  }

  return (
    <MessageButton
      title={title}
      variant={variant}
      onStartConversation={requireAuth(() => {
        createConversation.mutate({
          members: [channel],
        });
      })}
    />
  );
};

const MessageButton = ({
  title,
  variant,
  onStartConversation,
}: {
  title?: string,
  variant?: TODO,
  onStartConversation?: () => void;
}) => {
  return (
    <Button variant={variant ?? "secondary"} className="w-fit" onClick={onStartConversation}>
      <ChatIcon />
      {title ?? 'Message'}
    </Button>
  );
};
