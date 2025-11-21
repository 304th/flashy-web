import { usePartitionedQuery } from "@/lib/query-toolkit-v2";
import { notificationsCollection } from "@/features/notifications/entities/notifications.collection";
import { useMe } from "@/features/auth/queries/use-me";

export const useNotifications = () => {
  const { data: me } = useMe();

  return usePartitionedQuery<
    UserNotification,
    { lastKey?: string }
  >({
    queryKey: ["notifications", me?.fbId],
    collection: notificationsCollection,
    getParams: () => ({ lastKey: undefined }) as any,
    options: {
      enabled: Boolean(me),
    },
  });
};
