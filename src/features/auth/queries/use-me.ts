import { api } from "@/services/api";
import { getQuery } from "@/lib/query";
import { useAuthedUser } from "@/features/auth/hooks/use-authed-user";

export const useMe = () => {
  const currentUser = useAuthedUser();

  return getQuery<User>(
    ["me", currentUser?.uid],
    async () => await api.get("auth/me/logged-in").json(),
    () => Boolean(currentUser),
  );
};
