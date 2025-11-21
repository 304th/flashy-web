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
    getParams: ({ pageParam }) => ({ lastKey: pageParam as unknown as string | undefined }) as any,
    options: {
      enabled: Boolean(me),
      getNextPageParam: (lastPage: UserNotification[]) => {
        if (Array.isArray(lastPage) && lastPage.length > 0) {
          const lastNotification = lastPage[lastPage.length - 1];

          return lastNotification.orderId;
        }
        return undefined;
      },
      initialPageParam: undefined as any,
    },
  });
};
