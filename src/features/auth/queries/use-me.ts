import { api } from "@/services/api";
import { useLiveEntity } from "@/lib/query-toolkit";
import { useAuthedUser } from "@/features/auth/hooks/use-authed-user";
import { createEntity } from "@/lib/query-toolkit/entity";

const meEntity = createEntity<User>({
  sourceFrom: async () => {
    return await api.get("auth/me/logged-in").json();
  },
});

export const useMe = () => {
  const currentUser = useAuthedUser();

  return useLiveEntity<User>({
    entity: meEntity,
    queryKey: ["me", currentUser?.uid],
    options: {
      enabled: Boolean(currentUser),
    },
  });
};
