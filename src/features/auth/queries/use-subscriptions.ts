import { createEntity, useLiveEntity } from "@/lib/query-toolkit";
import { api } from "@/services/api";
import { useAuthedUser } from "@/features/auth/hooks/use-authed-user";

const subscriptions = createEntity<string[]>({
  sourceFrom: async () => {
    return await api.get("users/followingList").json();
  },
});

export const useSubscriptions = () => {
  const currentUser = useAuthedUser();

  return useLiveEntity<string[]>({
    queryKey: ["me", "subscriptions"],
    entity: subscriptions,
    options: {
      enabled: Boolean(currentUser),
    },
  });
};
