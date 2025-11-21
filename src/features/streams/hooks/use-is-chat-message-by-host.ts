import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsChatMessageByHost = (
  chatMessage: ChatMessage,
  stream: Stream,
) => {
  return useMemo(
    () => stream.userId === chatMessage.user?.fbId,
    [stream, chatMessage],
  );
};
