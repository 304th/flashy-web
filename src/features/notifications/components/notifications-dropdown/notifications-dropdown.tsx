import { useEffect, useRef } from "react";
import { NotificationItem } from "@/features/notifications/components/notification-item/notification-item";
import { useNotifications } from "@/features/notifications/queries/use-notifications";
import { Spinner } from "@/components/ui/spinner/spinner";
import { InfiniteFeed } from "@/components/ui/infinite-feed";
import { Loadable } from "@/components/ui/loadable";
import { usePathnameChangedEffect } from "@/hooks/use-pathname-changed-effect";
import { useMarkNotificationsAsRead } from "@/features/notifications/mutations/use-mark-notifications-as-read";

const groupNotificationsByDate = (notifications: UserNotification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, UserNotification[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.time);
    const notificationDay = new Date(
      notificationDate.getFullYear(),
      notificationDate.getMonth(),
      notificationDate.getDate(),
    );

    if (notificationDay.getTime() === today.getTime()) {
      groups.Today.push(notification);
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  return groups;
};

export const NotificationsDropdown = ({ onClose }: { onClose: () => void }) => {
  const { data: notifications, query } = useNotifications();
  const markAsRead = useMarkNotificationsAsRead();
  const hasMarkedAsRead = useRef(false);

  const notificationsList = notifications || [];
  const groupedNotifications = groupNotificationsByDate(notificationsList);

  usePathnameChangedEffect(onClose);

  useEffect(() => {
    if (hasMarkedAsRead.current) return;

    const timeout = setTimeout(() => {
      hasMarkedAsRead.current = true;
      markAsRead.mutate(undefined);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [markAsRead]);

  return (
    <div className="bg-base-300">
      <div className="sticky top-0 bg-base-300 border-b border-base-400 z-10">
        <div className="flex items-center justify-between p-3">
          <h1 className="font-semibold text-white">Notifications</h1>
          {/*<button className="p-2 hover:bg-base-400 rounded-lg transition-colors">*/}
          {/*  <Filter className="w-5 h-5 text-white" />*/}
          {/*</button>*/}
        </div>
      </div>
      <InfiniteFeed query={query}>
        <Loadable
          queries={[query as any]}
          fallback={
            <div className="flex w-full p-1 justify-center">
              <Spinner />
            </div>
          }
        >
          {() =>
            notificationsList.length > 0 ? (
              <div>
                {Object.entries(groupedNotifications).map(
                  ([dateLabel, items]) => {
                    if (items.length === 0) return null;

                    return (
                      <div key={dateLabel}>
                        <div className="bg-base-400 p-1 sticky top-[48px] z-[5]">
                          <h2
                            className="text-white font-medium text-sm
                              text-center"
                          >
                            {dateLabel}
                          </h2>
                        </div>
                        <div>
                          {items.map((notification) => (
                            <NotificationItem
                              key={notification._id}
                              notification={notification}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400">No notifications yet</p>
              </div>
            )
          }
        </Loadable>
      </InfiniteFeed>
    </div>
  );
};
