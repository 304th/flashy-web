import { useMemo } from 'react';
import { useMe } from "@/features/auth/queries/use-me";

export const useConversationTitle = (conversation: Conversation) => {
  const { data: me } = useMe();

  return useMemo(() => {
    if (conversation.title) {
      return conversation.title;
    }

    if (conversation.members.length > 2) {
      return conversation.members.filter(user => user.fbId !== me?.fbId).map(user => user.username).join(', ');
    }

    return conversation.members.find(user => user.fbId !== me?.fbId)?.username;
  }, [conversation, me]);
}