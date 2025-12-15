import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/ui/icons/chat";
import { useProtectedAction } from "@/features/auth/hooks/use-protected-action";
import { useCreateConversation } from "@/features/messaging/mutations/use-create-conversation";
import { useSearchConversationWithUser } from "@/features/messaging/queries/use-search-conversation-with-user";

export const ChannelMessageButton = ({ channel, variant, title, className, }: { channel: User; variant?: string; title?: string; className?: string }) => {
  const { requireAuth } = useProtectedAction();
  const [conversationWithUser] = useSearchConversationWithUser(channel?.fbId);
  const createConversation = useCreateConversation();

  if (conversationWithUser) {
    return (
      <Link href={`/messages/chat?id=${conversationWithUser._id}`} className={className}>
        <MessageButton variant={variant} title={title} className={className} />
      </Link>
    );
  }

  return (
    <MessageButton
      title={title}
      variant={variant}
      className={className}
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
  className,
  onStartConversation,
}: {
  title?: string,
  variant?: TODO,
  className?: string,
  onStartConversation?: () => void;
}) => {
  return (
    <Button variant={variant ?? "secondary"} className={`w-fit ${className}`} onClick={onStartConversation}>
      <ChatIcon />
      {title ?? 'Message'}
    </Button>
  );
};
