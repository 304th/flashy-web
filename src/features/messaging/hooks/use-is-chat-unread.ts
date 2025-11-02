import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsChatUnread = (chat?: Conversation) => {
  const { data: me } = useMe();

  return useMemo(
    () => (me?.fbId ? !chat?.readBy.includes(me?.fbId) : false),
    [me, chat],
  );
};
