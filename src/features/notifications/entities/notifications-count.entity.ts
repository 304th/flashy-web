import { api } from "@/services/api";
import { createEntity } from "@/lib/query-toolkit-v2";

export const notificationsCountEntity = createEntity<{ value: number }>({
  async sourceFrom() {
    return api.get("unreadAlertsCount").json<{ value: number }>();
  },
  name: "notificationsCount",
});
