import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsStreamChatMessageOwned = (chatMessage: ChatMessage) => {
  const { data: me } = useMe();

  return useMemo(() => {
    if (!me) {
      return false;
    }

    return me.fbId === chatMessage.user.fbId;
  }, [chatMessage, me]);
};
