import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsStreamHost = (stream: Stream) => {
  const { data: me } = useMe();

  return useMemo(() => me?.fbId === stream.userId, [me, stream]);
};
