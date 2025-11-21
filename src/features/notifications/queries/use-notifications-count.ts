import { api } from "@/services/api";
import {getQuery} from "@/lib/query-toolkit-v2";
import {useMe} from "@/features/auth/queries/use-me";

export const useNotificationsCount = () => {
  const { data: me } = useMe();

  return getQuery(['notifications', me?.fbId, 'count'], async () => {
    const response = await api.get('unreadAlertsCount').json<{ value: number }>();

    return response.value;
  }, Boolean(me));
}