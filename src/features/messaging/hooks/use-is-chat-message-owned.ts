import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsChatMessageOwned = (message?: Message | null) => {
  const { data: me } = useMe();

  return useMemo(() => me?.fbId === message?.author.fbId, [me, message]);
};
