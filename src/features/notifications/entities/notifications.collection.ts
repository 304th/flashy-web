import { createCollection } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { notificationSchema } from "@/features/notifications/schemas/notification.schema";

export const notificationsCollection = createCollection<
  TODO,
  { lastKey?: string; }
>({
  async sourceFrom(params) {
    const response = await api
      .get(`v2/notifications`, {
        searchParams: {
          lastKey: params.lastKey || '',
          filter: 'ALL',
        }
      })
      .json<{ series: UserNotification[] }>();

    return response.series;
  },
  schema: notificationSchema,
  name: "notifications",
});
