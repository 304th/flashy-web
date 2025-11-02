import { useConversationTitle } from "@/features/messaging/hooks/use-conversation-title";

export const ConversationTitle = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const title = useConversationTitle(conversation);

  return <p className="text-white text-lg font-medium ellipsis max-w-4/5">{title}</p>;
};
