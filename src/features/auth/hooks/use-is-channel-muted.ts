import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsChannelMuted = (channelId?: string) => {
  const { data: me } = useMe();

  return useMemo(
    () => (channelId ? me?.mutedUsers?.includes(channelId) : false),
    [me, channelId],
  );
};
