import { useMemo } from "react";
import {useProfileConversations} from "@/features/profile/queries/use-profile-conversations";
import {useMe} from "@/features/auth/queries/use-me";
import { extractChatIdFromMembers } from "@/features/messaging/utils/conversation-utils";

export const useConversationWithUserExists = (userId?: string) => {
  const { data: me } = useMe();
  const { data: conversations } = useProfileConversations();

  return useMemo(() => conversations?.find(conversation => extractChatIdFromMembers(conversation.members) === extractChatIdFromMembers([me?.fbId!, userId!])), [me, conversations]);
}