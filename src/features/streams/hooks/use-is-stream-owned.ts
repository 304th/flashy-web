import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsStreamOwned = (stream: Stream) => {
  const { data: me } = useMe();

  return useMemo(() => {
    if (!me) {
      return false;
    }

    return me.fbId === stream.userId;
  }, [stream, me]);
};
