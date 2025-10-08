import { createEntity, useLiveEntity } from "@/lib/query-toolkit-v2";
import { api } from "@/services/api";
import { useAuthed } from "@/features/auth/hooks/use-authed";

export const subscriptionsEntity = createEntity<string[]>({
  sourceFrom: async () => {
    return await api.get("users/followingList").json();
  },
  name: "subscriptions",
});

export const useSubscriptions = () => {
  const authed = useAuthed();

  return useLiveEntity<string[]>({
    queryKey: ["me", authed.user?.uid, "subscriptions"],
    entity: subscriptionsEntity,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
