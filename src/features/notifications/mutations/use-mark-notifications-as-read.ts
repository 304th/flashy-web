import { createMutation, useOptimisticMutation } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import {notificationsCountEntity} from "@/features/notifications/entities/notifications-count.entity";

const markNotificationsAsRead = createMutation({
  write: async () => {
    return api.post(`unreadAlerts`);
  },
});

export const useMarkNotificationsAsRead = () => {
  return useOptimisticMutation({
    mutation: markNotificationsAsRead,
    onOptimistic: (ch, params) => {
      return ch(notificationsCountEntity).update((count) => {
        count.value = 0;
      })
    },
  });
};
