import { useMemo } from "react";
import { useSubscriptions } from "@/features/auth/queries/use-subscriptions";

export const useIsSubscribed = (channelId: string) => {
  const { data: subscriptions } = useSubscriptions();

  return useMemo(
    () => Boolean(subscriptions?.find?.((sub: string) => sub === channelId)),
    [subscriptions, channelId],
  );
};
