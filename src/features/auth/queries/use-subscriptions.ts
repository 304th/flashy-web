import { createEntity, useLiveEntity } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useAuthed } from "@/features/auth/hooks/use-authed";

const subscriptions = createEntity<string[]>({
  sourceFrom: async () => {
    return await api.get("users/followingList").json();
  },
});

export const useSubscriptions = () => {
  const authed = useAuthed();

  return useLiveEntity<string[]>({
    queryKey: ["me", authed.user?.uid, "subscriptions"],
    entity: subscriptions,
    options: {
      enabled: Boolean(authed.user?.uid),
    },
  });
};
