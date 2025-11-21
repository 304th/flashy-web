import { Filter } from "lucide-react";
import { NotificationItem } from "@/features/notifications/components/notification-item/notification-item";
import { useNotifications } from "@/features/notifications/queries/use-notifications";
import { Spinner } from "@/components/ui/spinner/spinner";

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
      notificationDate.getDate()
    );

    if (notificationDay.getTime() === today.getTime()) {
      groups.Today.push(notification);
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  // Sort each group by most recent first
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => b.time - a.time);
  });

  return groups;
};

export const NotificationsDropdown = () => {
  const { data: notifications, query } = useNotifications();

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  const notificationsList = notifications || [];
  const groupedNotifications = groupNotificationsByDate(notificationsList);

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
      <div>
        {Object.entries(groupedNotifications).map(([dateLabel, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={dateLabel}>
              <div className="bg-base-400 p-1 sticky top-[48px] z-[5]">
                <h2 className="text-white font-medium text-sm text-center">
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
        })}

        {notificationsList.length === 0 && !query.isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
