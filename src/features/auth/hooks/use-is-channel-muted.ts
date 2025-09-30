import { useMemo } from "react";
import { useMe } from "@/features/auth/queries/use-me";

export const useIsChannelMuted = (channelId: string) => {
  const { data: me } = useMe();

  return useMemo(() => me?.mutedUsers?.includes(channelId), [me]);
};
