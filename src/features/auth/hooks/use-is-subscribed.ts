import { useMemo } from "react";
import { useSubscriptions } from "@/features/auth/queries/use-subscriptions";

export const useIsSubscribed = (channelId?: string) => {
  const { data: subscriptions, query } = useSubscriptions();
  const isSubscribed = useMemo(
    () => Boolean(subscriptions?.find?.((sub: string) => sub === channelId)),
    [subscriptions, channelId],
  );

  return [isSubscribed, query] as const;
};
