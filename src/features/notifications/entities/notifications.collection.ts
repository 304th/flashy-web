import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { notificationSchema } from "@/features/notifications/schemas/notification.schema";

export const notificationsCollection = createCollection<
  UserNotification,
  { lastKey?: string }
>({
  async sourceFrom(params) {
    const response = await api
      .get(`v2/notifications`, {
        searchParams: {
          lastAlert: params.lastKey || '',
          filter: 'ALL',
        }
      })
      .json<{ notifications: UserNotification[] }>();

    return response.notifications;
  },
  schema: notificationSchema,
  name: "notifications",
});
