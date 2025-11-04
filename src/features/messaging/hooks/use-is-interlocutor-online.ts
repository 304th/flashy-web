import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsInterlocutorOnline = (conversation: Conversation) => {
  const { data: me } = useMe();

  return useMemo(
    () =>
      conversation.members?.find((member) => member.fbId !== me?.fbId)?.online,
    [me, conversation],
  );
};
