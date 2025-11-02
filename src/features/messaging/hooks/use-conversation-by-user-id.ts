import { useMemo } from "react";
import { useProfileConversations } from "@/features/profile/queries/use-profile-conversations";
import { useMe } from "@/features/auth/queries/use-me";

export const useConversationByUserId = (userId?: string) => {
  const { data: me } = useMe();
  const { data: conversations } = useProfileConversations();

  return useMemo(() => {
    if (!userId || !conversations) return undefined;

    return conversations.find((conversation) => {
      // Check if this conversation includes both the user and me
      const hasUser = conversation.members.some(
        (member) => member.fbId === userId,
      );
      const hasMe = me?.fbId
        ? conversation.members.some((member) => member.fbId === me.fbId)
        : true;

      // For direct messages, it should be exactly 2 members
      return hasUser && hasMe && conversation.type === "chat";
    });
  }, [conversations, userId, me?.fbId]);
};
