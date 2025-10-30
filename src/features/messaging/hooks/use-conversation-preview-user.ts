import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useConversationPreviewUser = (conversation: Conversation) => {
  const { data: me } = useMe();

  return useMemo(() => {
    if (!conversation.lastMessage) {
      return conversation.members.find((member) => member.fbId !== me?.fbId);
    }

    return conversation.members.find((member) => member.fbId !== me?.fbId);
  }, [conversation, me]);
};
