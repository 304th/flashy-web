import {useIsInterlocutorOnline} from "@/features/messaging/hooks/use-is-interlocutor-online";

export const ConversationOnline = ({ conversation }: { conversation: Conversation }) => {
  const isOnline = useIsInterlocutorOnline(conversation);

  if (!isOnline) {
    return null;
  }

  return <p className="text-sm text-green-400">Online</p>
}