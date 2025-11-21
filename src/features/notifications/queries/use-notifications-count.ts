import {useLiveEntity} from "@/lib/query-toolkit-v2";
import {useMe} from "@/features/auth/queries/use-me";
import {notificationsCountEntity} from "@/features/notifications/entities/notifications-count.entity";

export const useNotificationsCount = () => {
  const { data: me } = useMe();

  return useLiveEntity({
    queryKey: ["notifications", me?.fbId, "count"],
    entity: notificationsCountEntity,
    options: {
      enabled: Boolean(me?.fbId),
    }
  })
}
